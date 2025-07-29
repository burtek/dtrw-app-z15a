import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { jobs } from '../database/schemas/jobs';
import { rangesCollide } from '../dateRange/dateRange';
import { DrizzleService } from '../drizzle/drizzle.service';
import { IsPlainDateValidConstraint, PlainDate } from '../validators/plainDate';

import { JobDto } from './job.dto';


@Injectable()
export class JobsService {
    constructor(private readonly databaseService: DrizzleService) {
    }

    async create(job: JobDto, user: string) {
        await Promise.all([
            this.validateJobRange(job),
            this.validateAccess(job, user)
        ]);

        const [newJob] = await this.databaseService.db
            .insert(jobs)
            .values(this.fromDtoToSchema(job, user))
            .returning();
        return newJob;
    }

    findAll(user: string) {
        return this.databaseService.db.query.jobs
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, job: JobDto, user: string) {
        await Promise.all([
            this.validateJobRange(job, id),
            this.validateAccess(job, user)
        ]);

        const [updated] = await this.databaseService.db
            .update(jobs)
            .set(this.fromDtoToSchema(job, user))
            .where(and(eq(jobs.id, id), eq(jobs.userId, user)))
            .returning();

        return updated;
    }

    private assertPlainDate(input: string): PlainDate {
        if (!new IsPlainDateValidConstraint().validate(input)) {
            throw new BadRequestException('input is not a date');
        }
        return input;
    }

    private fromDtoToSchema(job: JobDto, userId: string): typeof jobs.$inferInsert {
        return {
            caretakerId: job.caretakerId,
            company: job.company,
            nip: job.nip,
            from: job.from ? this.assertPlainDate(job.from) : null,
            to: job.to ? this.assertPlainDate(job.to) : null,
            notes: job.notes,
            userId
        };
    }

    private async validateAccess(job: JobDto, user: string) {
        const caretaker = await this.databaseService.db.query.caretakers
            .findFirst({ where: (t, u) => u.eq(t.id, job.caretakerId) });

        if (caretaker?.userId !== user) {
            throw new ForbiddenException('Foreign caretaker');
        }
    }

    private async validateJobRange(job: JobDto, id?: number) {
        if (job.from && job.to && job.from > job.to) {
            [job.from, job.to] = [job.to, job.from];
        }

        const allJobs = await this.databaseService.db.query.jobs
            .findMany({
                where: (t, u) => {
                    if (typeof id === 'number') {
                        return u.and(
                            u.eq(t.caretakerId, job.caretakerId),
                            u.ne(t.id, id)
                        );
                    }
                    return u.eq(t.caretakerId, job.caretakerId);
                }
            });

        if (allJobs.some(currentJob => rangesCollide(currentJob, job, false))) {
            throw new BadRequestException('jobs for caretaker overlap');
        }
    }
}

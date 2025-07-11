import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { rangesCollide } from 'src/dateRange/dateRange';

import { jobs } from '../database/schemas/jobs';
import { DrizzleAsyncProvider, DrizzleDb } from '../drizzle/drizzle.provider';
import { IsPlainDateValidConstraint, PlainDate } from '../validators/plainDate';

import { JobDto } from './job.dto';


@Injectable()
export class JobsService {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private readonly db: DrizzleDb
    ) {
    }

    async create(job: JobDto) {
        await this.validateJobRange(job);

        const [newJob] = await this.db
            .insert(jobs)
            .values(this.fromDtoToSchema(job))
            .returning();
        return newJob;
    }

    findAll() {
        return this.db.query.jobs.findMany();
    }

    findOne(id: number) {
        return this.db.query.jobs.findFirst({
            where: (t, u) => u.eq(t.id, sql.placeholder('id')),
            with: {
                caretaker: true,
                leaves: { with: { kid: true } }
            }
        }).prepare().execute({ id });
    }

    async update(id: number, job: JobDto) {
        await this.validateJobRange(job, id);

        const [updated] = await this.db
            .update(jobs)
            .set(this.fromDtoToSchema(job))
            .where(eq(jobs.id, id))
            .returning();

        return updated;
    }

    private assertPlainDate(input: string): PlainDate {
        if (!new IsPlainDateValidConstraint().validate(input)) {
            throw new TypeError('input is not a date');
        }
        return input;
    }

    private fromDtoToSchema(job: JobDto): typeof jobs.$inferInsert {
        return {
            caretakerId: job.caretakerId,
            company: job.company,
            nip: job.nip,
            from: job.from ? this.assertPlainDate(job.from) : null,
            to: job.to ? this.assertPlainDate(job.to) : null,
            notes: job.notes
        };
    }

    private async validateJobRange(job: JobDto, id?: number) {
        if (job.from && job.to && job.from > job.to) {
            [job.from, job.to] = [job.to, job.from];
        }

        const allJobs = await this.db.query.jobs
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
            throw new Error('jobs for caretaker overlap');
        }
    }
}

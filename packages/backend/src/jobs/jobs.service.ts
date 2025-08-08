import { and, eq, sql } from 'drizzle-orm';

import { BaseRepo } from '../database/repo';
import { jobs } from '../database/schemas/jobs';
import { rangesCollide } from '../dateRange/dateRange';
import { AppError, ErrorType } from '../errors';

import type { Job } from './job.schema';


export class JobsService extends BaseRepo {
    async create(job: Job, user: string) {
        await Promise.all([
            this.validateJobRange(job),
            this.validateAccess(job, user)
        ]);

        const [newJob] = await this.db
            .insert(jobs)
            .values(this.fromDtoToSchema(job, user))
            .returning();
        return newJob;
    }

    findAll(user: string) {
        return this.db.query.jobs
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, job: Job, user: string) {
        await Promise.all([
            this.validateJobRange(job, id),
            this.validateAccess(job, user)
        ]);

        const [updated] = await this.db
            .update(jobs)
            .set(this.fromDtoToSchema(job, user))
            .where(and(eq(jobs.id, id), eq(jobs.userId, user)))
            .returning();

        return updated;
    }

    private fromDtoToSchema(job: Job, userId: string): typeof jobs.$inferInsert {
        return {
            caretakerId: job.caretakerId,
            company: job.company,
            nip: job.nip,
            from: job.from,
            to: job.to,
            notes: job.notes,
            userId
        };
    }

    private async validateAccess(job: Job, user: string) {
        const caretaker = await this.db.query.caretakers
            .findFirst({ where: (t, u) => u.eq(t.id, job.caretakerId) });

        if (caretaker?.userId !== user) {
            throw new AppError(ErrorType.UNAUTHORIZED, 'Foreign caretaker');
        }
    }

    private async validateJobRange(job: Job, id?: number) {
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
            throw new AppError(ErrorType.BAD_REQUEST, 'Jobs for caretaker overlap');
        }
    }
}

import { and, eq, ne, sql } from 'drizzle-orm';

import { BaseRepo } from '../database/repo';
import { jobs, leaves } from '../database/schemas';
import { rangesCollide } from '../dateRange/dateRange';
import { AppError, ErrorType } from '../errors';

import type { Leave } from './leave.schema';


export class LeavesService extends BaseRepo {
    async create(leave: Leave, user: string) {
        await this.validateData(leave, user);

        const [newLeave] = await this.db
            .insert(leaves)
            .values(this.fromDtoToSchema(leave, user))
            .returning();
        return newLeave;
    }

    findAll(user: string) {
        return this.db.query.leaves
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, leave: Leave, user: string) {
        await this.validateData(leave, user, id);

        const [updated] = await this.db
            .update(leaves)
            .set(this.fromDtoToSchema(leave, user))
            .where(eq(leaves.id, id))
            .returning();

        return updated;
    }

    private fromDtoToSchema(leave: Leave, userId: string): typeof leaves.$inferInsert {
        return {
            zla: leave.zla,
            jobId: leave.jobId,
            kidId: leave.kidId,
            from: leave.from,
            to: leave.to,
            daysTaken: leave.daysTaken,
            z15aNotes: leave.z15aNotes,
            notes: leave.notes,
            userId
        };
    }

    private async validateData(leave: Leave, user: string, id?: number) {
        const [job, kid] = await Promise.all([
            this.db.query.jobs.findFirst({
                where: (t, u) => u.eq(t.id, leave.jobId),
                with: { caretaker: true }
            }),
            this.db.query.kids.findFirst({
                where: (t, u) => u.eq(t.id, leave.kidId),
                with: {
                    mother: true,
                    father: true
                }
            })
        ]);

        if (job?.userId !== user || kid?.userId !== user) {
            throw new AppError(ErrorType.UNAUTHORIZED, 'Not your data');
        }

        if (![kid.motherId, kid.fatherId].includes(job.caretakerId)) {
            throw new AppError(ErrorType.BAD_REQUEST, 'Child is not employee\'s child');
        }

        if (leave.from > leave.to) {
            [leave.from, leave.to] = [leave.to, leave.from];
        }

        const caretakerLeaves = await this.db
            .select({
                from: leaves.from,
                to: leaves.to
            })
            .from(leaves)
            .innerJoin(jobs, eq(leaves.jobId, jobs.id))
            .where(and(
                eq(jobs.caretakerId, job.caretakerId),
                ne(leaves.id, id ?? -1)
            ));

        if (caretakerLeaves.some(
            currentLeave => rangesCollide(currentLeave, leave, true)
        )) {
            throw new AppError(ErrorType.BAD_REQUEST, 'Leaves for caretaker overlap');
        }
    }
}

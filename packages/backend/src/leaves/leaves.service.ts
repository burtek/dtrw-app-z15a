import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { and, eq, ne, sql } from 'drizzle-orm';

import { jobs, leaves } from '../database/schemas';
import { rangesCollide } from '../dateRange/dateRange';
import { DrizzleAsyncProvider, DrizzleDb } from '../drizzle/drizzle.provider';
import { IsPlainDateValidConstraint, PlainDate } from '../validators/plainDate';

import { LeaveDto } from './leave.dto';


@Injectable()
export class LeavesService {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private readonly db: DrizzleDb
    ) {
    }

    async create(leave: LeaveDto, user: string) {
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

    async update(id: number, leave: LeaveDto, user: string) {
        await this.validateData(leave, user, id);

        const [updated] = await this.db
            .update(leaves)
            .set(this.fromDtoToSchema(leave, user))
            .where(eq(leaves.id, id))
            .returning();

        return updated;
    }

    private assertPlainDate(input: string): PlainDate {
        if (!new IsPlainDateValidConstraint().validate(input)) {
            throw new TypeError('input is not a date');
        }
        return input;
    }

    private fromDtoToSchema(leave: LeaveDto, userId: string): typeof leaves.$inferInsert {
        return {
            zla: leave.zla,
            jobId: leave.jobId,
            kidId: leave.kidId,
            from: this.assertPlainDate(leave.from),
            to: this.assertPlainDate(leave.to),
            daysTaken: leave.daysTaken.map(this.assertPlainDate),
            z15aNotes: leave.z15aNotes,
            notes: leave.notes,
            userId
        };
    }

    private async validateData(leave: LeaveDto, user: string, id?: number) {
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
            throw new ForbiddenException('Not your data');
        }

        if (![kid.motherId, kid.fatherId].includes(job.caretakerId)) {
            throw new BadRequestException('Child is not employee\'s child');
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
            throw new Error('leaves for caretaker overlap');
        }
    }
}

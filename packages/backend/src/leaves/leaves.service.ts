import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

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

    async create(leave: LeaveDto) {
        await this.validateLeaveRange(leave);

        const [newLeave] = await this.db
            .insert(leaves)
            .values(this.fromDtoToSchema(leave))
            .returning();
        return newLeave;
    }

    findAll() {
        return this.db.query.leaves.findMany();
    }

    findOne(id: number) {
        return this.db.query.leaves.findFirst({
            where: (t, u) => u.eq(t.id, sql.placeholder('id')),
            with: {
                job: { with: { caretaker: true } },
                kid: true
            }
        }).prepare().execute({ id });
    }

    async update(id: number, leave: LeaveDto) {
        await this.validateLeaveRange(leave, id);

        const [updated] = await this.db
            .update(leaves)
            .set(this.fromDtoToSchema(leave))
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

    private fromDtoToSchema(leave: LeaveDto): typeof leaves.$inferInsert {
        return {
            zla: leave.zla,
            jobId: leave.jobId,
            kidId: leave.kidId,
            from: this.assertPlainDate(leave.from),
            to: this.assertPlainDate(leave.to),
            daysTaken: leave.daysTaken.map(this.assertPlainDate),
            z15aNotes: leave.z15aNotes,
            notes: leave.notes
        };
    }

    private async validateLeaveRange(leave: LeaveDto, id?: number) {
        if (leave.from > leave.to) {
            [leave.from, leave.to] = [leave.to, leave.from];
        }

        const leaveJob = await this.db.query.jobs.findFirst({ where: eq(jobs.id, leave.jobId) });
        if (!leaveJob) {
            throw new Error('cannot find job for leave');
        }
        const allLeaves = await this.db.query.leaves
            .findMany({
                with: { job: true },
                where: (t, u) => u.ne(t.id, id ?? -1)
            });
        const allCaretakerLeaves = allLeaves.filter(thisLeave => thisLeave.job.caretakerId === leaveJob.caretakerId);

        if (allCaretakerLeaves.some(
            currentLeave => rangesCollide(currentLeave, leave, true)
        )) {
            throw new Error('leaves for caretaker overlap');
        }
    }
}

import { and, eq, sql } from 'drizzle-orm';

import { BaseRepo } from '../database/repo';
import { parentalLeaves } from '../database/schemas/parental-leaves';
import { AppError, ErrorType } from '../errors';

import type { ParentalLeave } from './parental-leave.schema';


export class ParentalLeavesService extends BaseRepo {
    async create(parentalLeave: ParentalLeave, user: string) {
        await this.validateAccess(parentalLeave, user);

        const [newParentalLeave] = await this.db
            .insert(parentalLeaves)
            .values(this.fromDtoToSchema(parentalLeave, user))
            .returning();
        return newParentalLeave;
    }

    findAll(user: string) {
        return this.db.query.parentalLeaves
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, parentalLeave: ParentalLeave, user: string) {
        await this.validateAccess(parentalLeave, user);

        const [updated] = await this.db
            .update(parentalLeaves)
            .set(this.fromDtoToSchema(parentalLeave, user))
            .where(and(eq(parentalLeaves.id, id), eq(parentalLeaves.userId, user)))
            .returning();

        return updated;
    }

    private fromDtoToSchema(parentalLeave: ParentalLeave, userId: string): typeof parentalLeaves.$inferInsert {
        return {
            kidId: parentalLeave.kidId,
            caretakerId: parentalLeave.caretakerId,
            dateFrom: parentalLeave.dateFrom,
            weeksCount: parentalLeave.weeksCount,
            userId
        };
    }

    private async validateAccess(parentalLeave: ParentalLeave, user: string) {
        const [kid, caretaker] = await Promise.all([
            this.db.query.kids.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, parentalLeave.kidId),
                    u.eq(t.userId, user)
                )
            }),
            this.db.query.caretakers.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, parentalLeave.caretakerId),
                    u.eq(t.userId, user)
                )
            })
        ]);

        if (kid?.userId !== user || caretaker?.userId !== user) {
            throw new AppError(ErrorType.UNAUTHORIZED, 'Foreign kid or caretaker');
        }

        if (![kid.motherId, kid.fatherId].includes(parentalLeave.caretakerId)) {
            throw new AppError(ErrorType.BAD_REQUEST, 'Caretaker is not a parent of this child');
        }
    }
}

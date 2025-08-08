import { and, eq, sql } from 'drizzle-orm';

import { BaseRepo } from '../database/repo';
import { kids } from '../database/schemas/kids';
import { AppError, ErrorType } from '../errors';

import type { Kid } from './kid.schema';


export class KidsService extends BaseRepo {
    async create(kid: Kid, user: string) {
        if (kid.fatherId === kid.motherId) {
            throw new AppError(ErrorType.BAD_REQUEST, 'Parents must be different');
        }

        await this.validateAccess(kid, user);

        const [newKid] = await this.db
            .insert(kids)
            .values(this.fromDtoToSchema(kid, user))
            .returning();
        return newKid;
    }

    findAll(user: string) {
        return this.db.query.kids
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, kid: Kid, user: string) {
        if (kid.fatherId === kid.motherId) {
            throw new AppError(ErrorType.BAD_REQUEST, 'Parents must be different');
        }

        await this.validateAccess(kid, user);

        const [updated] = await this.db
            .update(kids)
            .set(this.fromDtoToSchema(kid, user))
            .where(and(eq(kids.id, id), eq(kids.userId, user)))
            .returning();

        return updated;
    }

    private fromDtoToSchema(kid: Kid, userId: string): typeof kids.$inferInsert {
        return {
            name: kid.name,
            surname: kid.surname,
            pesel: kid.pesel,
            fatherId: kid.fatherId,
            motherId: kid.motherId,
            notes: kid.notes,
            userId
        };
    }

    private async validateAccess(kid: Kid, user: string) {
        const [mother, father] = await Promise.all([
            this.db.query.caretakers.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, kid.motherId),
                    u.eq(t.userId, user)
                )
            }),
            this.db.query.caretakers.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, kid.fatherId),
                    u.eq(t.userId, user)
                )
            })
        ]);

        if (mother?.userId !== user || father?.userId !== user) {
            throw new AppError(ErrorType.UNAUTHORIZED, 'Foreign caretaker');
        }
    }
}

import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { caretakers } from '../database/schemas/caretakers';
import { DrizzleAsyncProvider, DrizzleDb } from '../drizzle/drizzle.provider';

import { CaretakerDto } from './caretaker.dto';


@Injectable()
export class CaretakersService {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private readonly db: DrizzleDb
    ) {
    }

    async create(caretaker: CaretakerDto, user: string) {
        const [newCaretaker] = await this.db
            .insert(caretakers)
            .values(this.fromDtoToSchema(caretaker, user))
            .returning();
        return newCaretaker;
    }

    findAll(user: string) {
        return this.db.query.caretakers
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, caretaker: CaretakerDto, user: string) {
        const [updated] = await this.db
            .update(caretakers)
            .set(this.fromDtoToSchema(caretaker, user))
            .where(and(eq(caretakers.id, id), eq(caretakers.userId, user)))
            .returning();

        return updated;
    }

    private fromDtoToSchema(caretaker: CaretakerDto, userId: string): typeof caretakers.$inferInsert {
        return {
            pesel: caretaker.pesel,
            name: caretaker.name,
            surname: caretaker.surname,
            street: caretaker.street,
            streetNo: caretaker.streetNo,
            flatNo: caretaker.flatNo,
            zipCode: caretaker.zipCode,
            city: caretaker.city,
            email: caretaker.email,
            notes: caretaker.notes,
            bankAccountNumber: caretaker.bankAccountNumber,
            userId
        };
    }
}

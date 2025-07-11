import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

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

    async create(caretaker: CaretakerDto) {
        const [newCaretaker] = await this.db
            .insert(caretakers)
            .values(this.fromDtoToSchema(caretaker))
            .returning();
        return newCaretaker;
    }

    findAll() {
        return this.db.query.caretakers.findMany();
    }

    findOne(id: number) {
        return this.db.query.caretakers.findFirst({
            where: (t, u) => u.eq(t.id, sql.placeholder('id')),
            with: { jobs: true }
        }).prepare().execute({ id });
    }

    async update(id: number, caretaker: CaretakerDto) {
        const [updated] = await this.db
            .update(caretakers)
            .set(this.fromDtoToSchema(caretaker))
            .where(eq(caretakers.id, id))
            .returning();

        return updated;
    }

    private fromDtoToSchema(caretaker: CaretakerDto): typeof caretakers.$inferInsert {
        return {
            pesel: caretaker.pesel,
            name: caretaker.name,
            surname: caretaker.surname,
            street: caretaker.street,
            streetNo: caretaker.streetNo,
            flatNo: caretaker.flatNo,
            zipCode: caretaker.zipCode,
            city: caretaker.city,
            notes: caretaker.notes
        };
    }
}

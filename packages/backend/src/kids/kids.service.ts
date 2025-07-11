import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { kids } from '../database/schemas/kids';
import { DrizzleAsyncProvider, DrizzleDb } from '../drizzle/drizzle.provider';

import { KidDto } from './kid.dto';


@Injectable()
export class KidsService {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private readonly db: DrizzleDb
    ) {
    }

    async create(kid: KidDto) {
        if (kid.fatherId === kid.motherId) {
            throw new Error('Parents must be different');
        }

        const [newKid] = await this.db
            .insert(kids)
            .values(this.fromDtoToSchema(kid))
            .returning();
        return newKid;
    }

    findAll() {
        return this.db.query.kids.findMany();
    }

    findOne(id: number) {
        return this.db.query.kids.findFirst({
            where: (t, u) => u.eq(t.id, sql.placeholder('id')),
            with: { leaves: { with: { job: { with: { caretaker: true } } } } }
        }).prepare().execute({ id });
    }

    async update(id: number, kid: KidDto) {
        if (kid.fatherId === kid.motherId) {
            throw new Error('Parents must be different');
        }

        const [updated] = await this.db
            .update(kids)
            .set(this.fromDtoToSchema(kid))
            .where(eq(kids.id, id))
            .returning();

        return updated;
    }

    private fromDtoToSchema(kid: KidDto): typeof kids.$inferInsert {
        return {
            name: kid.name,
            surname: kid.surname,
            pesel: kid.pesel,
            fatherId: kid.fatherId,
            motherId: kid.motherId,
            notes: kid.notes
        };
    }
}

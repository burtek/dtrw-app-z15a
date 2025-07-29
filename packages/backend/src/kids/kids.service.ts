import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { kids } from '../database/schemas/kids';
import { DrizzleService } from '../drizzle/drizzle.service';

import { KidDto } from './kid.dto';


@Injectable()
export class KidsService {
    constructor(private readonly databaseService: DrizzleService) {
    }

    async create(kid: KidDto, user: string) {
        if (kid.fatherId === kid.motherId) {
            throw new BadRequestException('Parents must be different');
        }

        await this.validateAccess(kid, user);

        const [newKid] = await this.databaseService.db
            .insert(kids)
            .values(this.fromDtoToSchema(kid, user))
            .returning();
        return newKid;
    }

    findAll(user: string) {
        return this.databaseService.db.query.kids
            .findMany({ where: (t, u) => u.eq(t.userId, sql.placeholder('user')) })
            .prepare()
            .execute({ user });
    }

    async update(id: number, kid: KidDto, user: string) {
        if (kid.fatherId === kid.motherId) {
            throw new BadRequestException('Parents must be different');
        }

        await this.validateAccess(kid, user);

        const [updated] = await this.databaseService.db
            .update(kids)
            .set(this.fromDtoToSchema(kid, user))
            .where(and(eq(kids.id, id), eq(kids.userId, user)))
            .returning();

        return updated;
    }

    private fromDtoToSchema(kid: KidDto, userId: string): typeof kids.$inferInsert {
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

    private async validateAccess(kid: KidDto, user: string) {
        const [mother, father] = await Promise.all([
            this.databaseService.db.query.caretakers.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, kid.motherId),
                    u.eq(t.userId, user)
                )
            }),
            this.databaseService.db.query.caretakers.findFirst({
                where: (t, u) => u.and(
                    u.eq(t.id, kid.fatherId),
                    u.eq(t.userId, user)
                )
            })
        ]);

        if (mother?.userId !== user || father?.userId !== user) {
            throw new ForbiddenException('Foreign caretaker');
        }
    }
}

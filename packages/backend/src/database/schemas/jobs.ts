import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import type { PlainDate } from '../../validators/plainDate';

import { caretakers } from './caretakers';


export const jobs = table('jobs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    caretakerId: integer('caretaker').notNull().references(() => caretakers.id, { onDelete: 'cascade' }),
    company: text('name').notNull(),
    nip: text('nip').notNull(),
    from: text('form').$type<PlainDate>(),
    to: text('to').$type<PlainDate>(),
    notes: text('notes'),

    userId: text('userId').notNull().default('--unassigned--')
});

export type Job = typeof jobs.$inferSelect;

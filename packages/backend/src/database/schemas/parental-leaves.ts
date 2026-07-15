import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import type { PlainDate } from '../../schemas/plainDate';

import { caretakers } from './caretakers';
import { kids } from './kids';


export const parentalLeaves = table('parental_leaves', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kidId: integer('kid_id').notNull().references(() => kids.id, { onDelete: 'cascade' }),
    caretakerId: integer('caretaker_id').notNull().references(() => caretakers.id, { onDelete: 'cascade' }),
    dateFrom: text('date_from').$type<PlainDate>().notNull(),
    weeksCount: integer('weeks_count').notNull(),
    userId: text('userId').notNull().default('--unassigned--')
});

export type ParentalLeave = typeof parentalLeaves.$inferSelect;

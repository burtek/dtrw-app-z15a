import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import { caretakers } from './caretakers';


export const kids = table('kids', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    pesel: text('pesel').notNull().unique(),
    name: text('name').notNull(),
    surname: text('surname').notNull(),
    fatherId: integer('father_id').notNull().references(() => caretakers.id, { onDelete: 'restrict' }),
    motherId: integer('mother_id').notNull().references(() => caretakers.id, { onDelete: 'restrict' }),
    notes: text('notes'),

    userId: text('userId').notNull().default('--unassigned--')
});

export type Kid = typeof kids.$inferSelect;

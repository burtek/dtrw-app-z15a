import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';


export const caretakers = table('caretakers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    pesel: text('pesel').notNull().unique(),
    name: text('name').notNull(),
    surname: text('surname').notNull(),
    street: text('street').notNull(),
    streetNo: text('street_no').notNull(),
    flatNo: text('flat_no'),
    zipCode: text('zip_code').notNull(),
    city: text('city').notNull(),
    notes: text('notes')
});

export type Caretaker = typeof caretakers.$inferSelect;

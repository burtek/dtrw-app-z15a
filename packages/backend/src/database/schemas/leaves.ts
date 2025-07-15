import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import type { PlainDate } from '../../validators/plainDate';

import { jobs } from './jobs';
import { kids } from './kids';


export const leaves = table('leaves', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    zla: text('zla').unique(),

    jobId: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
    kidId: integer('kid_id').notNull().references(() => kids.id, { onDelete: 'cascade' }),

    from: text('date_from').$type<PlainDate>().notNull(),
    to: text('date_to').$type<PlainDate>().notNull(),
    daysTaken: text('days_taken', { mode: 'json' }).$type<PlainDate[]>().notNull(),

    z15aNotes: text('z15a_notes'),
    notes: text('notes'),

    userId: text('userId').notNull().default('--unassigned--')
});

export type Leave = typeof leaves.$inferSelect;

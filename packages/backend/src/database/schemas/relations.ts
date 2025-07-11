import { relations } from 'drizzle-orm';

import { caretakers } from './caretakers';
import { jobs } from './jobs';
import { kids } from './kids';
import { leaves } from './leaves';


export const caretakerRelations = relations(caretakers, ({ many }) => ({
    jobs: many(jobs),
    kids: many(kids)
}));

export const jobRelations = relations(jobs, ({ one, many }) => ({
    caretaker: one(caretakers, {
        fields: [jobs.caretakerId],
        references: [caretakers.id]
    }),
    leaves: many(leaves)
}));

export const leaveRelations = relations(leaves, ({ one }) => ({
    kid: one(kids, {
        fields: [leaves.kidId],
        references: [kids.id]
    }),
    job: one(jobs, {
        fields: [leaves.jobId],
        references: [jobs.id]
    })
}));

export const kidRelations = relations(kids, ({ one, many }) => ({
    leaves: many(leaves),
    father: one(caretakers, {
        fields: [kids.fatherId],
        references: [caretakers.id],
        relationName: 'father'
    }),
    mother: one(caretakers, {
        fields: [kids.motherId],
        references: [caretakers.id],
        relationName: 'mother'
    })
}));

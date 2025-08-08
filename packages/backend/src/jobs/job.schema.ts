import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod/v4';

import { jobs } from '../database/schemas/jobs';
import { NIPSchema } from '../schemas/nip';
import { PlainDateSchema } from '../schemas/plainDate';


export const JobSchema = createInsertSchema(jobs, {
    caretakerId: schema => schema.min(1),
    nip: NIPSchema,
    from: PlainDateSchema.nullable(),
    to: PlainDateSchema.nullable()
}).omit({ id: true, userId: true }).strict();

export type Job = z.infer<typeof JobSchema>;

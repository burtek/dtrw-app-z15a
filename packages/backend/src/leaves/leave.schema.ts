import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { leaves } from '../database/schemas/leaves';
import { PlainDateSchema } from '../schemas/plainDate';


export const LeaveSchema = createInsertSchema(leaves, {
    from: PlainDateSchema,
    to: PlainDateSchema,
    daysTaken: z.array(PlainDateSchema),
    jobId: schema => schema.min(1),
    kidId: schema => schema.min(1)
}).omit({ id: true, userId: true }).strict();

export type Leave = z.infer<typeof LeaveSchema>;

import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod/v4';

import { parentalLeaves } from '../database/schemas/parental-leaves';
import { PlainDateSchema } from '../schemas/plainDate';


export const ParentalLeaveSchema = createInsertSchema(parentalLeaves, {
    dateFrom: PlainDateSchema,
    kidId: schema => schema.min(1),
    caretakerId: schema => schema.min(1),
    weeksCount: schema => schema.min(1)
}).omit({ id: true, userId: true }).strict();

export type ParentalLeave = z.infer<typeof ParentalLeaveSchema>;

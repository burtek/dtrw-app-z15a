import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { caretakers } from '../database/schemas/caretakers';
import { BANSchema } from '../schemas/bank-acc-number';
import { PESELSchema } from '../schemas/pesel';


export const CaretakerSchema = createInsertSchema(caretakers, {
    pesel: PESELSchema,
    email: z.email(),
    bankAccountNumber: BANSchema
}).omit({ id: true, userId: true }).strict();

export type Caretaker = z.infer<typeof CaretakerSchema>;

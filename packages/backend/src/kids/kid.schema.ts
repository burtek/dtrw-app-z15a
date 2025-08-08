import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod/v4';

import { kids } from '../database/schemas/kids';
import { PESELSchema } from '../schemas/pesel';


export const KidSchema = createInsertSchema(kids, {
    pesel: PESELSchema,
    name: schema => schema.nonempty(),
    surname: schema => schema.nonempty(),
    fatherId: schema => schema.min(1),
    motherId: schema => schema.min(1)
}).omit({ id: true, userId: true }).strict();

export type Kid = z.infer<typeof KidSchema>;

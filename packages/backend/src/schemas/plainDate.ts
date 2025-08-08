import { isDate } from 'validator';
import { z } from 'zod/v4';


export const PlainDateSchema = z.templateLiteral([z.int().min(1970).max(2100), '-', z.int().min(1).max(12), '-', z.int().min(1).max(31)], { error: 'Invalid date format' })
    .refine(
        date => isDate(date, { format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] }),
        { error: 'Invalid date' }
    );

export type PlainDate = z.infer<typeof PlainDateSchema>;

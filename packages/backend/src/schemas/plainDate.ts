import { isDate } from 'validator';
import { z } from 'zod/v4';


const MIN_YEAR = 1970;
const MAX_YEAR = 2100;
const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;

const year = z.int().min(MIN_YEAR).max(MAX_YEAR);
const month = z.int().min(MIN_MONTH).max(MAX_MONTH);
const day = z.int().min(MIN_DAY).max(MAX_DAY);

export const PlainDateSchema = z.templateLiteral([year, '-', month, '-', day], { error: 'Invalid date format' })
    .refine(
        date => isDate(date, { format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] }),
        { error: 'Invalid date' }
    );

export type PlainDate = z.infer<typeof PlainDateSchema>;

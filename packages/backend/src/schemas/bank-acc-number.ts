import isIBAN from 'validator/es/lib/isIBAN';
import { z } from 'zod/v4';


export const BANSchema = z.string()
    .length(26)
    .regex(/^\d{26}$/, { error: 'Bank Account Number must constist of 26 numeric digits only' })
    .refine(
        ban => isIBAN(`PL${ban}`),
        { error: 'Bank Account Number has invalid checksum' }
    );

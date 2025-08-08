import { z } from 'zod/v4';


export const NIPSchema = z.string()
    .length(10)
    .regex(/^\d{10}$/, { error: 'NIP must constist of 10 numeric digits only' })
    .refine(
        nip => {
            const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
            const digits = nip.split('').map(d => parseInt(d, 10));
            const sum = weights.reduce((acc, w, i) => acc + (w * digits[i]), 0);
            const checksum = sum % 11;

            return checksum === digits[9];
        },
        { error: 'NIP has invalid checksum' }
    );

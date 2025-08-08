import { z } from 'zod/v4';


export const PESELSchema = z.string()
    .length(11)
    .regex(/^\d{11}$/, { error: 'PESEL must constist of 11 numeric digits only' })
    .refine(
        pesel => {
            const month = parseInt(pesel.slice(2, 4), 10) % 20;
            if (month > 12) {
                return false;
            }

            const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
            const digits = pesel.split('').map(d => parseInt(d, 10));
            const sum = weights.reduce((acc, w, i) => acc + (w * digits[i]), 0);
            const checksum = (10 - (sum % 10)) % 10;

            return checksum === digits[10];
        },
        { error: 'PESEL has invalid checksum' }
    );

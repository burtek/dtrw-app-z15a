// import { useMemo } from 'react';


export enum Sex {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UKNNOWN = 'UNKNOWN'
}

type LabelType = 'label' | 'short' | 'kid';
export const sexLabels: Record<Sex, Record<LabelType, string>> = {
    [Sex.MALE]: {
        label: 'mężczyzna',
        kid: 'chłopiec',
        short: 'M'
    },
    [Sex.FEMALE]: {
        label: 'kobieta',
        kid: 'dziewczynka',
        short: 'K'
    },
    [Sex.UKNNOWN]: {
        label: 'nieznana',
        kid: 'nieznana',
        short: '?'
    }
};

export function getSex(pesel: string | undefined, asLabel: LabelType): string;
export function getSex(pesel: string | undefined): Sex;
export function getSex(pesel: string | undefined, asLabel?: LabelType) {
    let sex: Sex = Sex.UKNNOWN;
    if (pesel && /^\d{11}$/.test(pesel)) {
        sex = parseInt(pesel[9], 10) % 2 ? Sex.MALE : Sex.FEMALE;
    }
    return asLabel
        ? sexLabels[sex][asLabel]
        : sex;
}

// export function useGetSex(pesel: string | undefined, asLabel: LabelType): string;
// export function useGetSex(pesel: string | undefined): Sex;
// export function useGetSex(pesel: string | undefined, asLabel?: LabelType) {
//     return useMemo(
//         // dumb but makes TS happy
//         () => (asLabel ? getSex(pesel, asLabel) : getSex(pesel)),
//         [pesel, asLabel]
//     );
// }

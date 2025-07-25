export interface Caretaker {
    pesel: string;
    name: string;
    surname: string;
    street: string;
    streetNo: string;
    flatNo: string;
    zipCode: string;
    city: string;
    notes: string;
    email: string;
    bankAccountNumber?: string;
}

export interface Job {
    caretakerId: number;
    company: string;
    nip: string;
    from?: string | null;
    to?: string | null;
    notes: string;
}

export interface Kid {
    pesel: string;
    name: string;
    surname: string;
    disabled: boolean;
    fatherId: number;
    motherId: number;
    notes: string;
}

export interface Leave {
    zla?: string;
    jobId: number;
    kidId: number;
    from: string;
    to: string;
    daysTaken: string[];
    z15aNotes: string;
    notes: string;
}

export type WithId<T> = T & { id: number };
export type MaybeWithId<T> = T & { id?: number | null };

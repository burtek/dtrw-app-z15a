import type { PlainDate } from '../validators/plainDate';


export interface DateRange<Required extends boolean = false> {
    from: Required extends true ? PlainDate : PlainDate | null | undefined;
    to: Required extends true ? PlainDate : PlainDate | null | undefined;
}

export const rangesCollide = (range1: DateRange, range2: DateRange, edgesCollides: boolean) => {
    const start1 = range1.from ?? '0000-01-01';
    const end1 = range1.to ?? '9999-12-31';
    const start2 = range2.from ?? '0000-01-01';
    const end2 = range2.to ?? '9999-12-31';

    return edgesCollides
        ? !(end1 < start2 || end2 < start1)
        : !(end1 <= start2 || end2 <= start1);
};

/* eslint-disable @typescript-eslint/member-ordering */
import { IsInt, IsNotEmpty, IsString, Min, ValidateIf } from 'class-validator';

import { DateRange } from '../dateRange/dateRange';
import { IsNipValid } from '../validators/nip';
import { IsPlainDateValid, PlainDate } from '../validators/plainDate';


export class JobDto implements DateRange {
    @IsInt()
    @Min(1)
    caretakerId: number;

    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNipValid()
    nip: string;

    @IsPlainDateValid()
    @IsString()
    @ValidateIf((o: JobDto) => !!o.from)
    from: PlainDate | null | undefined;

    @IsPlainDateValid()
    @IsString()
    @ValidateIf((o: JobDto) => !!o.to)
    to: PlainDate | null | undefined;

    @IsString()
    notes: string;
}

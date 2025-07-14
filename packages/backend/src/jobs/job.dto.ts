/* eslint-disable @typescript-eslint/member-ordering */
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

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
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    @Transform(({ value }: { value: string | null | undefined }) => value || undefined)
    from: PlainDate | null | undefined;

    @IsPlainDateValid()
    @IsString()
    @ValidateIf((o: JobDto) => !!o.to)
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    @Transform(({ value }: { value: string | null | undefined }) => value || undefined)
    to: PlainDate | null | undefined;

    @IsString()
    @IsOptional()
    notes: string;
}

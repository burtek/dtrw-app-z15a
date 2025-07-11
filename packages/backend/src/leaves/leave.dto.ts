/* eslint-disable @typescript-eslint/member-ordering */
import { ArrayMinSize, IsArray, IsInt, IsString, Length, Min, ValidateIf } from 'class-validator';

import { DateRange } from '../dateRange/dateRange';
import { IsPlainDateValid, PlainDate } from '../validators/plainDate';


export class LeaveDto implements DateRange<true> {
    @Length(9, 9)
    @IsString()
    @ValidateIf((o: LeaveDto) => !!o.zla)
    zla?: string;

    @IsInt()
    @Min(1)
    jobId: number;

    @IsInt()
    @Min(1)
    kidId: number;

    @IsString()
    @IsPlainDateValid()
    from: PlainDate;

    @IsString()
    @IsPlainDateValid()
    to: PlainDate;

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsPlainDateValid({ each: true })
    daysTaken: string[];

    @IsString()
    z15aNotes: string;

    @IsString()
    notes: string;
}

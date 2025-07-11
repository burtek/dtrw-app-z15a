/* eslint-disable @typescript-eslint/member-ordering */
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { IsPeselValid } from '../validators/pesel';


export class KidDto {
    @IsString()
    @IsPeselValid()
    pesel: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsInt()
    @Min(1)
    fatherId: number;

    @IsInt()
    @Min(1)
    motherId: number;

    @IsString()
    notes: string;
}

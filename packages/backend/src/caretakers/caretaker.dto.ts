/* eslint-disable @typescript-eslint/member-ordering */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsPeselValid } from '../validators/pesel';


export class CaretakerDto {
    @IsString()
    @IsPeselValid()
    pesel: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    streetNo: string;

    @IsString()
    flatNo: string;

    @IsString()
    @IsNotEmpty()
    zipCode: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsOptional()
    notes: string;
}

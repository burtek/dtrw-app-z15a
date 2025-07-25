/* eslint-disable @typescript-eslint/member-ordering */
import { IsIBAN, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsPeselValid } from '../validators/pesel';
import { IsBankAccountNumberValid } from 'src/validators/bank-acc-number';


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

    @IsBankAccountNumberValid()
    @IsOptional()
    bankAccountNumber: string;

    @IsString()
    @IsOptional()
    email: string;
}

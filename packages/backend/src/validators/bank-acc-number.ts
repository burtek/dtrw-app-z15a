import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';
import isIBANValidator from 'validator/lib/isIBAN';


@ValidatorConstraint({ name: 'isBankAccountNumberValid', async: false })
export class IsBankAccountNumberValidConstraint implements ValidatorConstraintInterface {
    defaultMessage(/* args: ValidationArguments */) {
        return 'Bank Account Number is invalid';
    }

    validate(pesel: string /* , args: ValidationArguments */) {
        return typeof pesel === 'string' && isIBANValidator(`PL${pesel}`);
    }
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsBankAccountNumberValid(validationOptions?: ValidationOptions) {
    return function act(object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBankAccountNumberValidConstraint
        });
    };
}

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';


@ValidatorConstraint({ name: 'isPeselValid', async: false })
export class IsPeselValidConstraint implements ValidatorConstraintInterface {
    defaultMessage(/* args: ValidationArguments */) {
        return 'PESEL is invalid';
    }

    validate(pesel: string /* , args: ValidationArguments */) {
        if (!/^\d{11}$/.test(pesel)) {
            return false;
        }

        const month = parseInt(pesel.slice(2, 4), 10) % 20;
        if (month > 12) {
            return false;
        }

        const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
        const digits = pesel.split('').map(d => parseInt(d, 10));
        const sum = weights.reduce((acc, w, i) => acc + (w * digits[i]), 0);
        const checksum = (10 - (sum % 10)) % 10;

        return checksum === digits[10];
    }
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsPeselValid(validationOptions?: ValidationOptions) {
    return function act(object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPeselValidConstraint
        });
    };
}

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';


@ValidatorConstraint({ name: 'isNipValid', async: false })
export class IsNipValidConstraint implements ValidatorConstraintInterface {
    defaultMessage(/* args: ValidationArguments */) {
        return 'NIP is invalid';
    }

    validate(nip: string /* , args: ValidationArguments */) {
        if (!/^\d{10}$/.test(nip)) {
            return false;
        }

        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        const digits = nip.split('').map(d => parseInt(d, 10));
        const sum = weights.reduce((acc, w, i) => acc + (w * digits[i]), 0);
        const checksum = sum % 11;

        return checksum === digits[9];
    }
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsNipValid(validationOptions?: ValidationOptions) {
    return function act(object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNipValidConstraint
        });
    };
}

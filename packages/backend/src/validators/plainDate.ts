import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';


export type PlainDate = `${number}-${number}-${number}`;

@ValidatorConstraint({ name: 'isPlainDateValid', async: false })
export class IsPlainDateValidConstraint implements ValidatorConstraintInterface {
    defaultMessage(/* args: ValidationArguments */) {
        return 'Date is invalid';
    }

    validate(plainDate: string /* , args: ValidationArguments */): plainDate is PlainDate {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(plainDate)) {
            return false;
        }

        return new Date(plainDate).toISOString().startsWith(plainDate);
    }
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsPlainDateValid(validationOptions?: ValidationOptions) {
    return function act(object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPlainDateValidConstraint
        });
    };
}

import { Checkbox } from '@radix-ui/themes';
import { shallowEqual } from 'fast-equals';
import type { ComponentProps } from 'react';
import { memo, useCallback } from 'react';
import { useController } from 'react-hook-form';

import type { ControlProps, WithValidateRule } from './_typeHelpers';
import { FieldWrapper } from './_wrapper';


function checkValueType(value: unknown): asserts value is boolean | undefined {
    if (!['boolean', 'undefined'].includes(typeof value)) {
        throw new TypeError(`value should be boolean|undefined, ${typeof value} given instead`);
    }
}

const Component = <Values extends Record<string, unknown>>({ label, control, name, rules }: Props<Values>) => {
    const {
        field: { value: v, onChange, onBlur, disabled, ref },
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({ control, name, rules });
    const value = v as unknown;
    checkValueType(value);

    const handleChange = useCallback<NonNullable<ComponentProps<typeof Checkbox>['onCheckedChange']>>(newValue => {
        checkValueType(newValue);
        onChange(newValue);
    }, [onChange]);

    return (
        <FieldWrapper
            label={label}
            error={error}
            row
        >
            <Checkbox
                ref={ref}
                required={rules?.required}
                checked={value}
                onCheckedChange={handleChange}
                onBlur={onBlur}
                disabled={isSubmitting || disabled}
                variant="soft"
                color={error ? 'red' : undefined}
            />
        </FieldWrapper>
    );
};
Component.displayName = 'CheckboxField';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const CheckboxField = memo(
    Component,
    (
        { rules: prevRules, ...prevProps },
        { rules: nextRules, ...nextProps }
    ) => shallowEqual(prevRules, nextRules) && shallowEqual(prevProps, nextProps)
) as typeof Component;

interface Props<Values extends Record<string, unknown>> extends ControlProps<Values> {
    label: string;

    rules?: WithValidateRule<Values> & { required?: boolean };
}

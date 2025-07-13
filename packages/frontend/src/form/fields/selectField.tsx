import { Select } from '@radix-ui/themes';
import { memo, useCallback } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import type { FieldWrapperProps } from './_wrapper';
import { FieldWrapper } from './_wrapper';


const Component = <T,>(
    { label, error, items, renderItem, value, register, parseIntValue }: Props<T>
) => {
    const { disabled, name, onChange, ref, required } = register;

    const handleChange = useCallback((newValue: string) => onChange({
        target: {
            name,
            // eslint-disable-next-line no-nested-ternary
            value: newValue ? (parseIntValue ? parseInt(newValue, 10) : newValue) : undefined
        },
        type: 'change'
    }), [name, onChange]);

    return (
        <FieldWrapper
            label={label}
            error={error}
        >
            <Select.Root
                onValueChange={handleChange}
                disabled={disabled}
                required={required}
                value={value ?? ''}
                name={name}
            >
                <Select.Trigger
                    placeholder="Wybierz płatnika"
                    variant="soft"
                    color={error ? 'red' : undefined}
                    ref={ref}
                />
                <Select.Content>
                    <Select.Group>
                        {items.map(renderItem)}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </FieldWrapper>
    );
};
Component.displayName = 'SelectField';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const SelectField = memo(Component) as typeof Component;

interface Props<T> extends FieldWrapperProps {
    items: Array<T> | ReadonlyArray<T>;
    renderItem: (item: T) => React.ReactElement;
    value: string | undefined;
    register: UseFormRegisterReturn;
    parseIntValue?: boolean;
}

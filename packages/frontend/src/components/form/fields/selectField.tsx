import { Select } from '@radix-ui/themes';
import { shallowEqual } from 'fast-equals';
import { memo, useCallback, useEffect, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { FieldWrapper } from './_wrapper';


function checkValueType(value: unknown): asserts value is string | number | undefined {
    if (!['string', 'number', 'undefined'].includes(typeof value)) {
        throw new TypeError(`value should be string|number|undefined, ${typeof value} given instead`);
    }
}

const Component = <T, C extends Control>(
    { label, items, renderItem, parseIntValue, control, name, rules, placeholder }: Props<T, C>
) => {
    const {
        field: { value: v, onChange, onBlur, disabled, ref },
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({ control, name, rules });
    const value = v as unknown;
    checkValueType(value);

    const handleChange = useCallback((valueFromSelect: string) => {
        const newValue = valueFromSelect ? valueFromSelect : undefined;
        onChange(parseIntValue ? parseInt(valueFromSelect, 10) : newValue);
    }, [onChange, parseIntValue]);

    const [open, setOpen] = useState(false);

    const handleOpenStateChange = useCallback(
        (newState: boolean) => {
            setOpen(newState);
            if (!newState) {
                onBlur();
            }
        },
        [onBlur]
    );

    useEffect(() => {
        ref({
            focus() {
                setOpen(true);
            }
        });
    }, [ref]);

    useEffect(() => () => {
        ref(null);
    }, []);

    return (
        <FieldWrapper
            label={label}
            error={error}
        >
            <Select.Root
                onValueChange={handleChange}
                disabled={isSubmitting || disabled}
                required={rules?.required}
                value={value?.toString() ?? ''}
                name={name}
                open={open}
                onOpenChange={handleOpenStateChange}
            >
                <Select.Trigger
                    placeholder={placeholder}
                    variant="soft"
                    color={error ? 'red' : undefined}
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
export const SelectField = memo(
    Component,
    (
        { items: prevItems, rules: prevRules, ...prevProps },
        { items: nextItems, rules: nextRules, ...nextProps }
    ) => shallowEqual(prevItems, nextItems)
        && shallowEqual(prevRules, nextRules)
        && shallowEqual(prevProps, nextProps)
) as typeof Component;

interface Props<T, C extends Control> {
    items: Array<T> | ReadonlyArray<T>;
    renderItem: (item: T) => React.ReactElement;
    parseIntValue?: boolean;

    label: string;
    placeholder: string;

    control: C;
    name: C extends Control<infer Values> ? keyof Values : string;
    rules?: { required?: boolean };
}

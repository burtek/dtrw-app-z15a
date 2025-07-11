import { Checkbox } from '@radix-ui/themes';
import { memo } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import type { FieldWrapperProps } from './_wrapper';
import { FieldWrapper } from './_wrapper';


const Component = ({ label, error, checked, register }: Props) => (
    <FieldWrapper
        label={label}
        error={error}
        row
    >
        <Checkbox
            checked={checked}
            {...register}
            variant="soft"
            color={error ? 'red' : undefined}
        />
    </FieldWrapper>
);
Component.displayName = 'CheckboxField';

export const CheckboxField = memo(Component);

interface Props extends FieldWrapperProps {
    checked: boolean | undefined;
    register: UseFormRegisterReturn;
}

import { TextField as Input } from '@radix-ui/themes';
import { memo } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import type { FieldWrapperProps } from './_wrapper';
import { FieldWrapper } from './_wrapper';


const Component = ({ label, error, register }: Props) => (
    <FieldWrapper
        label={label}
        error={error}
    >
        <Input.Root
            {...register}
            variant="soft"
            color={error ? 'red' : undefined}
            type="date"
        />
    </FieldWrapper>
);
Component.displayName = 'DateField';

export const DateField = memo(Component);

interface Props extends FieldWrapperProps {
    register: UseFormRegisterReturn;
}

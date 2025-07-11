import { TextField as Input } from '@radix-ui/themes';
import { memo } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import type { FieldWrapperProps } from './_wrapper';
import { FieldWrapper } from './_wrapper';


const Component = ({ label, error, value, register }: Props) => (
    <FieldWrapper
        label={label}
        error={error}
    >
        <Input.Root
            value={value}
            {...register}
            variant="soft"
            color={error ? 'red' : undefined}
        />
    </FieldWrapper>
);
Component.displayName = 'TextField';

export const TextField = memo(Component);

interface Props extends FieldWrapperProps {
    value: string | undefined;
    register: UseFormRegisterReturn;
}

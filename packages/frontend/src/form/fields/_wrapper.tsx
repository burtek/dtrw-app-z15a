import { Flex, Text } from '@radix-ui/themes';
import type { PropsWithChildren } from 'react';


// eslint-disable-next-line @typescript-eslint/naming-convention
export const FieldWrapper = ({ as: Wrapper = 'label', children, error, label, row = false }: PropsWithChildren<FieldWrapperProps>) => (
    <Wrapper>
        <Flex
            direction={row ? 'row' : 'column'}
            gap={row ? '4' : '1'}
        >
            <Text
                size="2"
                weight="bold"
            >
                {label}
            </Text>
            {children}
            {error
                ? (
                    <Text
                        size="2"
                        color="red"
                    >
                        {error}
                    </Text>
                )
                : null}
        </Flex>
    </Wrapper>
);
FieldWrapper.displayName = 'FieldWrapper';

export interface FieldWrapperProps {
    error?: string;
    label: string;
    as?: 'div' | 'label';
    row?: boolean;
}

import { Box, Flex, Separator } from '@radix-ui/themes';
import type { Responsive } from '@radix-ui/themes/props';
import type { PropsWithChildren } from 'react';
import { Children, memo } from 'react';


const toResponsive = <Value extends string>(all: Value, sm: Value): Responsive<Value> => ({ initial: all, sm, md: all });

const Component = ({ children }: PropsWithChildren) => (
    <Flex
        gap="2"
        direction={toResponsive('row', 'column')}
        align={toResponsive('baseline', 'start')}
    >
        {Children.toArray(children).flatMap((child, index) => [
            index > 0 && (
                <Box
                    asChild
                    display={toResponsive('block', 'none')}
                >
                    <Separator orientation="vertical" />
                </Box>
            ),
            child
        ])}
    </Flex>
);
Component.displayName = 'ActionsWrapper';

export const ActionsWrapper = memo(Component);

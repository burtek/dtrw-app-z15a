import { Button } from '@radix-ui/themes';
import { deepEqual } from 'fast-equals';
import { memo, useCallback } from 'react';


const Component = <T extends [unknown] | unknown[]>({ data, onClick, ...props }: Props<T>) => {
    const handleClick = useCallback(() => {
        onClick(...data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.length, onClick, ...data]);

    return (
        <Button
            onClick={handleClick}
            {...props}
        />
    );
};
Component.displayName = 'CallbackButton';

interface Props<T extends [unknown] | unknown[]> extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
    data: T;
    onClick: (...args: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const CallbackButton = memo(Component, deepEqual) as typeof Component;

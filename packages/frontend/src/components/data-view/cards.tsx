import { Button, Flex } from '@radix-ui/themes';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { deepEqual } from 'fast-equals';
import type { ReactNode } from 'react';
import { memo } from 'react';

import { DataViewPlaceholder } from './placeholder';


const Component = <T extends { id: string | number }>({ isLoading, error, data, renderCard, onNewClick, newLabel }: Props<T>) => {
    const renderBody = () => {
        if (isLoading || error) {
            <DataViewPlaceholder error={error} />;
        }
        return data.map(renderCard);
    };

    return (
        <Flex
            direction="column"
            gap="2"
        >
            {renderBody()}
            <Button
                variant="ghost"
                onClick={onNewClick}
                disabled={isLoading || !!error}
            >
                {newLabel}
            </Button>
        </Flex>
    );
};

Component.displayName = 'DataCardsList';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const DataCardsList = memo(Component, deepEqual) as typeof Component;

export interface Props<T extends { id: string | number }> {
    isLoading: boolean;
    error: SerializedError | FetchBaseQueryError | undefined;

    data: T[];
    renderCard: (row: T) => ReactNode;

    onNewClick: () => void;
    newLabel: string;
}

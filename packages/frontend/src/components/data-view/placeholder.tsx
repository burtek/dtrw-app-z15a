import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { FC } from 'react';
import { memo } from 'react';
import Mosaic from 'react-loading-indicators/Mosaic';


const Component: FC<Props> = ({ error }) => {
    if (!error) {
        return <Mosaic />;
    }

    const getContent = () => {
        if ('status' in error) {
            return typeof error.status === 'number' ? `HTTP error: ${error.status}` : error.status;
        }
        return error.message ?? error.name ?? 'Unknown error occured';
    };

    return (
        <Callout.Root color="red">
            <Callout.Icon>
                <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
                {getContent()}
            </Callout.Text>

        </Callout.Root>
    );
};
Component.displayName = 'DataViewPlaceholder';

export const DataViewPlaceholder = memo(Component);

interface Props {
    error: SerializedError | FetchBaseQueryError | undefined;
}

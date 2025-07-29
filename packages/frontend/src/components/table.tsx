import { Button, Table, Text } from '@radix-ui/themes';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { JSX } from 'react';
import { memo } from 'react';
import Mosaic from 'react-loading-indicators/Mosaic';


const Component = <T,>({ isLoading, error, data, renderDataRow, headers, onNewClick, newLabel }: Props<T>) => {
    const renderPlaceholder = () => {
        if (!error) {
            return <Mosaic />;
        }
        // eslint-disable-next-line no-console
        console.error(error);
        if ('status' in error) {
            return <Text color="red">{typeof error.status === 'number' ? `HTTP error: ${error.status}` : error.status}</Text>;
        }
        return <Text color="red">{error.message ?? error.name ?? 'Unknown error occured'}</Text>;
    };

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    {headers.map((header, index) =>
                        // eslint-disable-next-line react/no-array-index-key
                        <Table.ColumnHeaderCell key={index}>{header}</Table.ColumnHeaderCell>)}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {isLoading || error
                    ? (
                        <Table.Row>
                            <Table.Cell colSpan={headers.length}>
                                {renderPlaceholder()}
                            </Table.Cell>
                        </Table.Row>
                    )
                    : data.map(renderDataRow)}
            </Table.Body>

            <tfoot>
                <Table.Row>
                    <Table.RowHeaderCell
                        colSpan={headers.length}
                        justify="center"
                    >
                        <Button
                            variant="ghost"
                            onClick={onNewClick}
                            disabled={isLoading || !!error}
                        >
                            {newLabel}
                        </Button>
                    </Table.RowHeaderCell>
                </Table.Row>
            </tfoot>
        </Table.Root>
    );
};

Component.displayName = 'DataTable';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const DataTable = memo(Component) as typeof Component;

interface Props<T> {
    isLoading: boolean;
    error: SerializedError | FetchBaseQueryError | undefined;

    headers: string[];
    data: T[];
    renderDataRow: (row: T) => JSX.Element;

    onNewClick: () => void;
    newLabel: string;
}

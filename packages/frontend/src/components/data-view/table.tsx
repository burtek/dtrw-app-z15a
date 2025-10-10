import { Button, Table } from '@radix-ui/themes';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ReactNode } from 'react';
import { memo } from 'react';

import { DataViewPlaceholder } from './placeholder';


const Component = <T extends { id: string | number }>({
    isLoading,
    error,
    data,
    renderTableRow,
    headers,
    onNewClick,
    newLabel,
    renderHeaderTools
}: Props<T>) => {
    const renderBody = () => {
        if (isLoading || error) {
            return (
                <Table.Row>
                    <Table.Cell colSpan={headers.length}>
                        <DataViewPlaceholder error={error} />
                    </Table.Cell>
                </Table.Row>
            );
        }
        return data.map(renderTableRow);
    };

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    {headers.map((header, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Table.ColumnHeaderCell key={index}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {header}
                                {renderHeaderTools?.(header, index)}
                            </div>
                        </Table.ColumnHeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {renderBody()}
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

export interface Props<T extends { id: string | number }> {
    isLoading: boolean;
    error: SerializedError | FetchBaseQueryError | undefined;

    data: T[];
    headers: string[];
    renderTableRow: (row: T) => ReactNode;

    onNewClick: () => void;
    newLabel: string;

    renderHeaderTools?: (header: string, index: number) => React.ReactNode;
}

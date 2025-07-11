import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useState } from 'react';

import { useData } from '../../data/provider';

import { LeaveFormDialog } from './form';


const Component = () => {
    const { kids: { data: kids }, jobs: { data: jobs }, caretakers: { data: caretakers }, leaves: { data: leaves } } = useData();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    return (
        <>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Dziecko</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Opiekun</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>ZLA</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Okres</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {leaves.map(leave => {
                        const kid = kids.find(k => k.id === leave.kidId);
                        const job = jobs.find(j => j.id === leave.jobId);
                        const caretaker = caretakers.find(c => c.id === job?.caretakerId);

                        return (
                            <Table.Row key={leave.id}>
                                <Table.RowHeaderCell>{leave.id}</Table.RowHeaderCell>
                                <Table.Cell>{kid?.name} {kid?.surname}</Table.Cell>
                                <Table.Cell>{caretaker?.name} {caretaker?.surname}</Table.Cell>
                                <Table.Cell>{leave.zla}</Table.Cell>
                                <Table.Cell>{leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`}</Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Button
                                            variant="ghost"
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onClick={() => {
                                                setDialogId(leave.id);
                                            }}
                                        >
                                            Edytuj
                                        </Button>
                                        <Separator orientation="vertical" />
                                        <Button
                                            variant="ghost"
                                            disabled
                                        >
                                            Usuń
                                        </Button>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>

                <tfoot>
                    <Table.Row>
                        <Table.RowHeaderCell
                            colSpan={6}
                            justify="center"
                        >
                            <Button
                                variant="ghost"
                                onClick={openNewDialog}
                            >
                                Dodaj nowe zwolnienie
                            </Button>
                        </Table.RowHeaderCell>
                    </Table.Row>
                </tfoot>
            </Table.Root>
            {dialogId !== false && (
                <LeaveFormDialog
                    id={dialogId}
                    close={closeDialog}
                />
            )}
        </>
    );
};
Component.displayName = 'LeavesTable';

export const LeavesTable = memo(Component);

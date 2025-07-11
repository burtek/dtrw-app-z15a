import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useState } from 'react';

import { useData } from '../../data/provider';

import { JobFormDialog } from './form';


const Component = () => {
    const { jobs: { data: jobs }, caretakers: { data: caretakers } } = useData();

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
                        <Table.ColumnHeaderCell>Firma</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>NIP</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Przypisany pracownik</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Okres</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {jobs.map(job => {
                        const caretaker = caretakers.find(c => c.id === job.caretakerId);

                        return (
                            <Table.Row key={job.id}>
                                <Table.RowHeaderCell>{job.id}</Table.RowHeaderCell>
                                <Table.Cell>{job.company}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{job.nip}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker?.name} {caretaker?.surname}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{job.from ?? '?'} - {job.to ?? 'nadal'}</Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Button
                                            variant="ghost"
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onClick={() => {
                                                setDialogId(job.id);
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
                                Dodaj nowego płatnika
                            </Button>
                        </Table.RowHeaderCell>
                    </Table.Row>
                </tfoot>
            </Table.Root>
            {dialogId !== false && (
                <JobFormDialog
                    id={dialogId}
                    close={closeDialog}
                />
            )}
        </>
    );
};
Component.displayName = 'JobsTable';

export const JobsTable = memo(Component);

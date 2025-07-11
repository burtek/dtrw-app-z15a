import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useState } from 'react';

import { useData } from '../../data/provider';


import { CaretakerFormDialog } from './form';


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
                        <Table.ColumnHeaderCell>Imię i nazwisko</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>PESEL</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Obecny płatnik</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell />
                        <Table.ColumnHeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {caretakers.map(caretaker => {
                        const job = jobs
                            .filter(j => j.caretakerId === caretaker.id)
                            .map(j => ({ ...j, castedFrom: j.from ?? '0000-00-00', castedTo: j.to ?? '9999-99-99' }))
                            .find(j => {
                                const today = new Date().toISOString().substring(0, 10);
                                return j.castedFrom <= today && today <= j.castedTo;
                            });
                        return (
                            <Table.Row key={caretaker.id}>
                                <Table.RowHeaderCell>{caretaker.id}</Table.RowHeaderCell>
                                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.name} {caretaker.surname}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.pesel}</Table.Cell>
                                <Table.Cell>{job?.company ?? 'brak'}</Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Button
                                            variant="ghost"
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onClick={() => {
                                                setDialogId(caretaker.id);
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
                                Dodaj nowego opiekuna
                            </Button>
                        </Table.RowHeaderCell>
                    </Table.Row>
                </tfoot>
            </Table.Root>
            {dialogId !== false && (
                <CaretakerFormDialog
                    id={dialogId}
                    close={closeDialog}
                />
            )}
        </>
    );
};
Component.displayName = 'CaretakersTable';

export const CaretakersTable = memo(Component);

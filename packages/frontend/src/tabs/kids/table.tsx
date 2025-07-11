import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useState } from 'react';

import { useData } from '../../data/provider';

import { KidFormDialog } from './form';


const Component = () => {
    const { kids: { data: kids }, caretakers: { data: caretakers } } = useData();

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
                        <Table.ColumnHeaderCell>Matka</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Ojciec</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {kids.map(kid => {
                        const father = caretakers.find(c => c.id === kid.fatherId);
                        const mother = caretakers.find(c => c.id === kid.motherId);

                        return (
                            <Table.Row key={kid.id}>
                                <Table.RowHeaderCell>{kid.id}</Table.RowHeaderCell>
                                <Table.Cell>{kid.name} {kid.surname}</Table.Cell>
                                <Table.Cell>{kid.pesel}</Table.Cell>
                                <Table.Cell>{mother?.name} {mother?.surname}</Table.Cell>
                                <Table.Cell>{father?.name} {father?.surname}</Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Button
                                            variant="ghost"
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onClick={() => {
                                                setDialogId(kid.id);
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
                                Dodaj nowe dziecko
                            </Button>
                        </Table.RowHeaderCell>
                    </Table.Row>
                </tfoot>
            </Table.Root>
            {dialogId !== false && (
                <KidFormDialog
                    id={dialogId}
                    close={closeDialog}
                />
            )}
        </>
    );
};
Component.displayName = 'KidsTable';

export const KidsTable = memo(Component);

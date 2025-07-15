import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { DataTable } from '../../components/table';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetKidsState } from '../../redux/apis/kids';
import type { Kid, WithId } from '../../types';

import { KidFormDialog } from './form';


const Component = () => {
    const { data: kids = [], error, isLoading } = useGetKidsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const renderKid = useCallback((kid: WithId<Kid>) => {
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
    }, [caretakers]);

    return (
        <>
            <DataTable
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Imię i nazwisko', 'PESEL', 'Matka', 'Ojciec', ''], [])}
                data={kids}
                renderDataRow={renderKid}
                onNewClick={openNewDialog}
                newLabel="Dodaj nowe dziecko"
            />
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

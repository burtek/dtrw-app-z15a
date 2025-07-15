import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { DataTable } from '../../components/table';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import type { Caretaker, WithId } from '../../types';

import { CaretakerFormDialog } from './form';


const Component = () => {
    const { data: caretakers = [], error, isLoading } = useGetCaretakersState();
    const { data: jobs = [] } = useGetJobsState();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const renderCaretaker = useCallback((caretaker: WithId<Caretaker>) => {
        const job = jobs
            .filter(j => j.caretakerId === caretaker.id)
            .map(j => ({ ...j, castedFrom: j.from ?? '0000-00-00', castedTo: j.to ?? '9999-99-99' }))
            .find(j => {
                const [today] = new Date().toISOString().split('T');
                return j.castedFrom <= today && today <= j.castedTo;
            });
        return (
            <Table.Row key={caretaker.id}>
                <Table.RowHeaderCell>{caretaker.id}</Table.RowHeaderCell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.name} {caretaker.surname}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.pesel}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.email}</Table.Cell>
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
    }, [jobs]);

    return (
        <>
            <DataTable
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Firma', 'NIP', 'Przypisany pracownik', 'Okres', ''], [])}
                data={caretakers}
                renderDataRow={renderCaretaker}
                onNewClick={openNewDialog}
                newLabel="Dodaj nowego opiekuna"
            />
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

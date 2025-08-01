import { Button, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import type { Caretaker, Job, WithId } from '../../types';

import { CaretakerFormDialog } from './form';


const calculateData = (caretaker: WithId<Caretaker>, jobs: WithId<Job>[]) => {
    const job = jobs
        .filter(j => j.caretakerId === caretaker.id)
        .map(j => ({ ...j, castedFrom: j.from ?? '0000-00-00', castedTo: j.to ?? '9999-99-99' }))
        .find(j => {
            const [today] = new Date().toISOString().split('T');
            return j.castedFrom <= today && today <= j.castedTo;
        });

    return {
        caretaker: `${caretaker.name} ${caretaker.surname}`,
        job
    };
};

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

    const actions = useCallback((caretaker: WithId<Caretaker>) => (
        <ActionsWrapper>
            <CallbackButton
                variant="ghost"
                onClick={setDialogId}
                data={[caretaker.id]}
            >
                Edytuj
            </CallbackButton>
            <Button
                variant="ghost"
                disabled
            >
                Usuń
            </Button>
        </ActionsWrapper>
    ), []);

    const renderTableRow = useCallback((caretaker: WithId<Caretaker>) => {
        const { caretaker: caretakerName, job } = calculateData(caretaker, jobs);

        return (
            <Table.Row key={caretaker.id}>
                <Table.RowHeaderCell>{caretaker.id}</Table.RowHeaderCell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretakerName}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.pesel}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{caretaker.email}</Table.Cell>
                <Table.Cell>{job?.company ?? 'brak'}</Table.Cell>
                <Table.Cell>{actions(caretaker)}</Table.Cell>
            </Table.Row>
        );
    }, [jobs, actions]);

    const renderCard = useCallback((caretaker: WithId<Caretaker>) => {
        const { caretaker: caretakerName, job } = calculateData(caretaker, jobs);

        return (
        /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={caretaker.id}
                id={caretaker.id}
                summary={caretakerName}
                secondary={{ PESEL: caretaker.pesel }}
                details={{
                    Email: caretaker.email,
                    'Aktualny płatnik': job?.company ?? 'brak'
                }}
                actions={actions(caretaker)}
            />
        /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [jobs, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Imię i nazwisko', 'PESEL', 'Email', 'Aktualny płatnik/pracodawca', ''], [])}
                data={caretakers}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
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

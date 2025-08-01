import { Button, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import type { Caretaker, Job, WithId } from '../../types';

import { JobFormDialog } from './form';


const calculateData = (job: WithId<Job>, caretakers: WithId<Caretaker>[]) => {
    const caretaker = caretakers.find(c => c.id === job.caretakerId);

    return {
        employee: `${caretaker?.name} ${caretaker?.surname}`,
        dates: `${job.from ?? '?'} - ${job.to ?? 'nadal'}`
    };
};

const Component = () => {
    const { data: jobs = [], error, isLoading } = useGetJobsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const actions = useCallback((job: WithId<Job>) => (
        <ActionsWrapper>
            <CallbackButton
                variant="ghost"
                onClick={setDialogId}
                data={[job.id]}
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

    const renderTableRow = useCallback((job: WithId<Job>) => {
        const { employee, dates } = calculateData(job, caretakers);

        return (
            <Table.Row key={job.id}>
                <Table.RowHeaderCell>{job.id}</Table.RowHeaderCell>
                <Table.Cell>{job.company}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{job.nip}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{employee}</Table.Cell>
                <Table.Cell style={{ whiteSpace: 'nowrap' }}>{dates}</Table.Cell>
                <Table.Cell>{actions(job)}</Table.Cell>
            </Table.Row>
        );
    }, [caretakers, actions]);

    const renderCard = useCallback((job: WithId<Job>) => {
        const { employee, dates } = calculateData(job, caretakers);

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={job.id}
                id={job.id}
                summary={job.company}
                secondary={{
                    Pracownik: employee,
                    Daty: dates
                }}
                details={{ NIP: job.nip }}
                actions={actions(job)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [caretakers, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Firma', 'NIP', 'Przypisany pracownik', 'Okres', ''], [])}
                data={jobs}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
                onNewClick={openNewDialog}
                newLabel="Dodaj nowego płatnika"
            />
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

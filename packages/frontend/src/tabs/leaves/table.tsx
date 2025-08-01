import { Button, Link, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import { useGetKidsState } from '../../redux/apis/kids';
import { useGetLeavesState, useSendEmail } from '../../redux/apis/leaves';
import type { Leave, WithId } from '../../types';

import { LeaveFormDialog } from './form';


const notifyDownload = () => {
    toast.info(
        'Trwa generowanie pliku, proszę o chwilę cierpliwości...',
        {
            theme: 'light',
            position: 'top-right'
        }
    );
};

const Component = () => {
    const { data: leaves = [], error, isLoading } = useGetLeavesState();
    const { data: kids = [] } = useGetKidsState();
    const { data: jobs = [] } = useGetJobsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [sendEmail] = useSendEmail();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const actions = useCallback((leave: WithId<Leave>, downloadName: string) => (
        <ActionsWrapper>
            <CallbackButton
                variant="ghost"
                onClick={setDialogId}
                data={[leave.id]}
            >
                Edytuj
            </CallbackButton>
            <Button
                variant="ghost"
                disabled
            >
                Usuń
            </Button>
            <Link
                href={`/api/pdf/${leave.id}?title=${encodeURIComponent(downloadName)}`}
                download={downloadName}
                onClick={notifyDownload}
            >
                Pobierz PDF
            </Link>
            <CallbackButton
                variant="ghost"
                onClick={sendEmail}
                data={[leave.id]}
            >
                Wyślij mailem do opiekuna
            </CallbackButton>
        </ActionsWrapper>
    ), [sendEmail]);

    const renderTableRow = useCallback((leave: WithId<Leave>) => {
        const kid = kids.find(k => k.id === leave.kidId);
        const job = jobs.find(j => j.id === leave.jobId);
        const caretaker = caretakers.find(c => c.id === job?.caretakerId);

        const downloadName = `${caretaker?.surname} ${caretaker?.name} - Z-15A za ${kid?.name} ${kid?.surname} za okres ${leave.from}${leave.from === leave.to ? '' : ` - ${leave.to}`}.pdf`;

        const leaveDates = leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`;

        return (
            <Table.Row key={leave.id}>
                <Table.RowHeaderCell>{leave.id}</Table.RowHeaderCell>
                <Table.Cell>{`${kid?.name} ${kid?.surname}`}</Table.Cell>
                <Table.Cell>{`${caretaker?.name} ${caretaker?.surname}`}</Table.Cell>
                <Table.Cell>{leave.zla}</Table.Cell>
                <Table.Cell>{`${leaveDates} (${leave.daysTaken.length} dni)`}</Table.Cell>
                <Table.Cell>{actions(leave, downloadName)}</Table.Cell>
            </Table.Row>
        );
    }, [caretakers, jobs, kids, actions]);

    const renderCard = useCallback((leave: WithId<Leave>) => {
        const kid = kids.find(k => k.id === leave.kidId);
        const job = jobs.find(j => j.id === leave.jobId);
        const caretaker = caretakers.find(c => c.id === job?.caretakerId);

        const downloadName = `${caretaker?.surname} ${caretaker?.name} - Z-15A za ${kid?.name} ${kid?.surname} za okres ${leave.from}${leave.from === leave.to ? '' : ` - ${leave.to}`}.pdf`;

        const leaveDates = leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`;

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={leave.id}
                id={leave.id}
                summary={`${kid?.name} ${kid?.surname}`}
                secondary={{
                    Opiekun: `${caretaker?.name} ${caretaker?.surname}`,
                    Daty: `${leaveDates} (${leave.daysTaken.length} dni)`
                }}
                details={{
                    ...leave.zla ? { ZLA: leave.zla } : {},
                    Płatnik: job?.company ?? 'nie znaleziono'
                }}
                actions={actions(leave, downloadName)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [caretakers, jobs, kids, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Dziecko', 'Opiekun', 'ZLA', 'Okres', ''], [])}
                data={leaves}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
                onNewClick={openNewDialog}
                newLabel="Dodaj nowe zwolnienie"
            />
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

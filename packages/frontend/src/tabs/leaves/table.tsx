import { Button, Flex, Link, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { DataTable } from '../../components/table';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import { useGetKidsState } from '../../redux/apis/kids';
import { useGetLeavesState, useSendEmail } from '../../redux/apis/leaves';
import type { Leave, WithId } from '../../types';

import { LeaveFormDialog } from './form';


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

    const notifyDownload = useCallback(() => {
        toast.info(
            'Trwa generowanie pliku, proszę o chwilę cierpliwości...',
            {
                theme: 'light',
                position: 'top-right'
            }
        );
    }, []);

    const renderLeave = useCallback((leave: WithId<Leave>) => {
        const kid = kids.find(k => k.id === leave.kidId);
        const job = jobs.find(j => j.id === leave.jobId);
        const caretaker = caretakers.find(c => c.id === job?.caretakerId);

        const downloadName = `${caretaker?.surname} ${caretaker?.name} - Z-15A za ${kid?.name} ${kid?.surname} za okres ${leave.from}${leave.from === leave.to ? '' : ` - ${leave.to}`}.pdf`;

        return (
            <Table.Row key={leave.id}>
                <Table.RowHeaderCell>{leave.id}</Table.RowHeaderCell>
                <Table.Cell>{kid?.name} {kid?.surname}</Table.Cell>
                <Table.Cell>{caretaker?.name} {caretaker?.surname}</Table.Cell>
                <Table.Cell>{leave.zla}</Table.Cell>
                <Table.Cell>
                    {leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`}
                    {` (${leave.daysTaken.length} dni)`}
                </Table.Cell>
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
                        <Separator orientation="vertical" />
                        <Link
                            href={`/api/pdf/${leave.id}?title=${encodeURIComponent(downloadName)}`}
                            download={downloadName}
                            onClick={notifyDownload}
                        >
                            Pobierz PDF
                        </Link>
                        <Separator orientation="vertical" />
                        <Button
                            variant="ghost"
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() => sendEmail(leave.id)}
                        >
                            Wyślij mailem do opiekuna
                        </Button>
                    </Flex>
                </Table.Cell>
            </Table.Row>
        );
    }, [caretakers, jobs, kids]);

    return (
        <>
            <DataTable
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Dziecko', 'Opiekun', 'ZLA', 'Okres', ''], [])}
                data={leaves}
                renderDataRow={renderLeave}
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

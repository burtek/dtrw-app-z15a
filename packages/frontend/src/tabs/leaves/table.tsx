import { Button, Link, Table } from '@radix-ui/themes';
import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import { useGetKidsState } from '../../redux/apis/kids';
import { useGetLeavesState, useSendEmail } from '../../redux/apis/leaves';
import type { Caretaker, Job, Kid, Leave, WithId } from '../../types';

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

const calculateData = (leave: WithId<Leave>, jobs: WithId<Job>[], kids: WithId<Kid>[], caretakers: WithId<Caretaker>[]) => {
    const kid = kids.find(k => k.id === leave.kidId);
    const job = jobs.find(j => j.id === leave.jobId);
    const caretaker = caretakers.find(c => c.id === job?.caretakerId);

    const downloadName = `${caretaker?.surname} ${caretaker?.name} - Z-15A za ${kid?.name} ${kid?.surname} za okres ${leave.from}${leave.from === leave.to ? '' : ` - ${leave.to}`}.pdf`;

    const leaveDates = leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`;

    return {
        kid: `${kid?.name} ${kid?.surname}`,
        job,
        caretaker: `${caretaker?.name} ${caretaker?.surname}`,
        downloadName,
        leaveDates: `${leaveDates} (${leave.daysTaken.length} ${leave.daysTaken.length === 1 ? 'dzień' : 'dni'})`
    };
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
        const { kid, caretaker, downloadName, leaveDates } = calculateData(leave, jobs, kids, caretakers);

        return (
            <Table.Row key={leave.id}>
                <Table.RowHeaderCell>{leave.id}</Table.RowHeaderCell>
                <Table.Cell>{kid}</Table.Cell>
                <Table.Cell>{caretaker}</Table.Cell>
                <Table.Cell>{leave.zla}</Table.Cell>
                <Table.Cell>{leaveDates}</Table.Cell>
                <Table.Cell>
                    {leave.z15aNotes ? `Uwagi Z-15A: ${leave.z15aNotes}` : null}
                    {leave.notes ? `Uwagi: ${leave.notes}` : null}
                </Table.Cell>
                <Table.Cell>{actions(leave, downloadName)}</Table.Cell>
            </Table.Row>
        );
    }, [caretakers, jobs, kids, actions]);

    const renderCard = useCallback((leave: WithId<Leave>) => {
        const { kid, job, caretaker, downloadName, leaveDates } = calculateData(leave, jobs, kids, caretakers);

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={leave.id}
                id={leave.id}
                summary={kid}
                secondary={{
                    Opiekun: caretaker,
                    Daty: leaveDates
                }}
                details={{
                    ...leave.zla ? { ZLA: leave.zla } : {},
                    Płatnik: job?.company ?? 'nie znaleziono',
                    ...leave.z15aNotes ? { 'Uwagi Z-15A': leave.z15aNotes } : {},
                    ...leave.notes ? { Uwagi: leave.notes } : {},
                }} 
                actions={actions(leave, downloadName)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [caretakers, jobs, kids, actions]);

    const [sort, setSort] = useState<{ column: string, dir: 'asc' | 'desc' }>({ column: 'ID', dir: 'asc' });

    const sortedLeaves = useMemo(() => {
        function sortFn(a: WithId<Leave>, b: WithId<Leave>) {
            const dataA = calculateData(a, jobs, kids, caretakers);
            const dataB = calculateData(b, jobs, kids, caretakers);
            switch (sort.column) {
                case 'Dziecko':
                    return dataA.kid.localeCompare(dataB.kid);
                case 'Opiekun':
                    return dataA.caretaker.localeCompare(dataB.caretaker);
                case 'ZLA':
                    return (a.zla ?? '').localeCompare((b.zla ?? ''));
                case 'Okres':
                    return a.from.localeCompare(b.from);
                case 'Uwagi':
                    return (a.notes || a.z15aNotes || '').localeCompare(b.notes || b.z15aNotes || '');
                case 'ID':
                default:
                    return a.id - b.id;
            }
        }

        return [...leaves].sort((a, b) => sort.dir === 'asc' ? sortFn(a, b) : sortFn(b, a))
    }, [sort, jobs, kids, caretakers]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Dziecko', 'Opiekun', 'ZLA', 'Okres', 'Uwagi', ''], [])}
                data={sortedLeaves}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
                onNewClick={openNewDialog}
                newLabel="Dodaj nowe zwolnienie"
                renderHeaderTools={header => {
                    let icon = <CaretSortIcon />;
                    let newSort: typeof sort = { column: header, dir: 'asc' };
                    if (sort?.column === header) {
                        switch (sort.dir) {
                            case 'asc':
                                icon = <CaretUpIcon />;
                                newSort.dir = 'desc';
                                break;
                            case 'desc':
                                icon = <CaretDownIcon />;
                                newSort = { column: 'ID', dir: 'asc' };
                                break;
                        }
                    }
                    
                    return (
                        <Fragment>
                            <div style={{ flex: 1 }} />
                            <Button onClick={() => setSort(newSort)} size="1" variant="ghost" asChild>{icon}</Button>
                        </Fragment>
                    )
                }}
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

import { Button, Flex, Separator, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { DataTable } from '../../components/table';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState } from '../../redux/apis/jobs';
import type { Job, WithId } from '../../types';

import { JobFormDialog } from './form';


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

    const renderJob = useCallback((job: WithId<Job>) => {
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
    }, [caretakers]);

    return (
        <>
            <DataTable
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Firma', 'NIP', 'Przypisany pracownik', 'Okres', ''], [])}
                data={jobs}
                renderDataRow={renderJob}
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

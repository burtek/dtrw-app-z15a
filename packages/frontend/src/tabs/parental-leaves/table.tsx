import { Button, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetKidsState } from '../../redux/apis/kids';
import { useGetParentalLeavesState } from '../../redux/apis/parental-leaves';
import type { Caretaker, Kid, ParentalLeave, WithId } from '../../types';

import { ParentalLeaveFormDialog } from './form';


const calculateData = (
    parentalLeave: WithId<ParentalLeave>,
    kids: WithId<Kid>[],
    caretakers: WithId<Caretaker>[]
) => {
    const kid = kids.find(k => k.id === parentalLeave.kidId);
    const caretaker = caretakers.find(c => c.id === parentalLeave.caretakerId);

    return {
        kid: `${kid?.name ?? ''} ${kid?.surname ?? ''}`.trim(),
        caretaker: `${caretaker?.name ?? ''} ${caretaker?.surname ?? ''}`.trim()
    };
};

const Component = () => {
    const { data: parentalLeaves = [], error, isLoading } = useGetParentalLeavesState();
    const { data: kids = [] } = useGetKidsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const actions = useCallback((parentalLeave: WithId<ParentalLeave>) => (
        <ActionsWrapper>
            <CallbackButton
                variant="ghost"
                onClick={setDialogId}
                data={[parentalLeave.id]}
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

    const renderTableRow = useCallback((parentalLeave: WithId<ParentalLeave>) => {
        const { kid, caretaker } = calculateData(parentalLeave, kids, caretakers);

        return (
            <Table.Row key={parentalLeave.id}>
                <Table.RowHeaderCell>{parentalLeave.id}</Table.RowHeaderCell>
                <Table.Cell>{kid}</Table.Cell>
                <Table.Cell>{caretaker}</Table.Cell>
                <Table.Cell>{parentalLeave.dateFrom}</Table.Cell>
                <Table.Cell>{parentalLeave.weeksCount}</Table.Cell>
                <Table.Cell>{actions(parentalLeave)}</Table.Cell>
            </Table.Row>
        );
    }, [kids, caretakers, actions]);

    const renderCard = useCallback((parentalLeave: WithId<ParentalLeave>) => {
        const { kid, caretaker } = calculateData(parentalLeave, kids, caretakers);

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={parentalLeave.id}
                id={parentalLeave.id}
                summary={kid}
                secondary={{ Rodzic: caretaker, 'Data od': parentalLeave.dateFrom }}
                details={{ 'Liczba tygodni': `${parentalLeave.weeksCount}` }}
                actions={actions(parentalLeave)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [kids, caretakers, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Dziecko', 'Rodzic', 'Data od', 'Liczba tygodni', ''], [])}
                data={parentalLeaves}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
                onNewClick={openNewDialog}
                newLabel="Dodaj urlop rodzicielski"
            />
            {dialogId !== false && (
                <ParentalLeaveFormDialog
                    id={dialogId}
                    close={closeDialog}
                />
            )}
        </>
    );
};
Component.displayName = 'ParentalLeavesTable';

export const ParentalLeavesTable = memo(Component);

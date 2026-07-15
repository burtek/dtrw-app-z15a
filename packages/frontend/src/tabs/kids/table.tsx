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
import { getSex } from '../../utils/sex';

import { KidFormDialog } from './form';


const calculateData = (kid: WithId<Kid>, caretakers: WithId<Caretaker>[], parentalLeaves: WithId<ParentalLeave>[]) => {
    const father = caretakers.find(c => c.id === kid.fatherId);
    const mother = caretakers.find(c => c.id === kid.motherId);
    const totalParentalLeaveWeeks = parentalLeaves
        .filter(pl => pl.kidId === kid.id)
        .reduce((sum, pl) => sum + pl.weeksCount, 0);

    return {
        kid: `${kid.name} ${kid.surname}`,
        mother: `${mother?.name} ${mother?.surname}`,
        father: `${father?.name} ${father?.surname}`,
        totalParentalLeaveWeeks
    };
};

const Component = () => {
    const { data: kids = [], error, isLoading } = useGetKidsState();
    const { data: caretakers = [] } = useGetCaretakersState();
    const { data: parentalLeaves = [] } = useGetParentalLeavesState();

    const [dialogId, setDialogId] = useState<number | null | false>(false);

    const closeDialog = useCallback(() => {
        setDialogId(false);
    }, []);
    const openNewDialog = useCallback(() => {
        setDialogId(null);
    }, []);

    const actions = useCallback((kid: WithId<Kid>) => (
        <ActionsWrapper>
            <CallbackButton
                variant="ghost"
                onClick={setDialogId}
                data={[kid.id]}
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

    const renderTableRow = useCallback((kid: WithId<Kid>) => {
        const { mother, father, kid: kidName, totalParentalLeaveWeeks } = calculateData(kid, caretakers, parentalLeaves);

        return (
            <Table.Row key={kid.id}>
                <Table.RowHeaderCell>{kid.id}</Table.RowHeaderCell>
                <Table.Cell>{kidName}</Table.Cell>
                <Table.Cell>{getSex(kid.pesel, 'kid')}</Table.Cell>
                <Table.Cell>{kid.pesel}</Table.Cell>
                <Table.Cell>{mother}</Table.Cell>
                <Table.Cell>{father}</Table.Cell>
                <Table.Cell>{totalParentalLeaveWeeks}</Table.Cell>
                <Table.Cell>{actions(kid)}</Table.Cell>
            </Table.Row>
        );
    }, [caretakers, parentalLeaves, actions]);

    const renderCard = useCallback((kid: WithId<Kid>) => {
        const { mother, father, kid: kidName, totalParentalLeaveWeeks } = calculateData(kid, caretakers, parentalLeaves);

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={kid.id}
                id={kid.id}
                summary={kidName}
                secondary={{ PESEL: kid.pesel }}
                details={{
                    Płeć: getSex(kid.pesel, 'kid'),
                    Matka: mother,
                    Ojciec: father,
                    'Tygodnie urlopu rodzicielskiego': totalParentalLeaveWeeks
                }}
                actions={actions(kid)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [caretakers, parentalLeaves, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Imię i nazwisko', 'Płeć', 'PESEL', 'Matka', 'Ojciec', 'Tygodnie urlopu', ''], [])}
                data={kids}
                renderTableRow={renderTableRow}
                renderCard={renderCard}
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

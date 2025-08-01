import { Button, Table } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';

import { CallbackButton } from '../../components/callback-button';
import { DataView } from '../../components/data-view';
import { ActionsWrapper } from '../../components/data-view/actions';
import { ExpandableCard } from '../../components/data-view/card';
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
        const father = caretakers.find(c => c.id === kid.fatherId);
        const mother = caretakers.find(c => c.id === kid.motherId);

        return (
            <Table.Row key={kid.id}>
                <Table.RowHeaderCell>{kid.id}</Table.RowHeaderCell>
                <Table.Cell>{`${kid.name} ${kid.surname}`}</Table.Cell>
                <Table.Cell>{kid.pesel}</Table.Cell>
                <Table.Cell>{`${mother?.name} ${mother?.surname}`}</Table.Cell>
                <Table.Cell>{`${father?.name} ${father?.surname}`}</Table.Cell>
                <Table.Cell>{actions(kid)}</Table.Cell>
            </Table.Row>
        );
    }, [caretakers, actions]);

    const renderCard = useCallback((kid: WithId<Kid>) => {
        const father = caretakers.find(c => c.id === kid.fatherId);
        const mother = caretakers.find(c => c.id === kid.motherId);

        return (
            /* eslint-disable @typescript-eslint/naming-convention */
            <ExpandableCard
                key={kid.id}
                id={kid.id}
                summary={`${kid.name} ${kid.surname}`}
                secondary={{ PESEL: kid.pesel }}
                details={{
                    Matka: `${mother?.name} ${mother?.surname}`,
                    Ojciec: `${father?.name} ${father?.surname}`
                }}
                actions={actions(kid)}
            />
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }, [caretakers, actions]);

    return (
        <>
            <DataView
                isLoading={isLoading}
                error={error}
                headers={useMemo(() => ['ID', 'Imię i nazwisko', 'PESEL', 'Matka', 'Ojciec', ''], [])}
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

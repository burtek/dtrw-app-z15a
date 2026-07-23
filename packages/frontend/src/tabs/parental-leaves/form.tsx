import { Box, Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { DateField } from '../../components/form/fields/dateField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetKidsState } from '../../redux/apis/kids';
import { useGetParentalLeavesState, useSaveParentalLeaveMutation } from '../../redux/apis/parental-leaves';
import type { Caretaker, Kid, ParentalLeave, WithId } from '../../types';


type FormParentalLeave = Omit<ParentalLeave, 'weeksCount'> & { weeksCount: string };

const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const { data: parentalLeaves = [] } = useGetParentalLeavesState();
    const { data: kids = [] } = useGetKidsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [saveParentalLeave, { isLoading }] = useSaveParentalLeaveMutation();

    const [defaultValues] = useState(() => {
        const entry = parentalLeaves.find(l => l.id === id);
        if (!entry) {
            return {};
        }
        return {
            ...entry,
            weeksCount: String(entry.weeksCount)
        };
    });
    const { control, handleSubmit, setError } = useForm<Partial<FormParentalLeave>>({ defaultValues });

    const onSubmit: SubmitHandler<Partial<FormParentalLeave>> = async data => {
        const parsedData = {
            ...data,
            weeksCount: parseInt(data.weeksCount ?? '0', 10)
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const response = await saveParentalLeave({ id, ...parsedData as ParentalLeave });

        if (response.data) {
            close();
        } else if ('status' in response.error) {
            let message: string;
            if (typeof response.error.data === 'object' && response.error.data !== null && 'message' in response.error.data && typeof response.error.data.message === 'string') {
                // eslint-disable-next-line @typescript-eslint/prefer-destructuring
                message = response.error.data.message;
            } else {
                message = JSON.stringify(response.error.data);
            }
            setError('kidId', { message });
        } else {
            setError('kidId', { message: String(response.error.message ?? response.error.name) });
        }
    };

    const handleClose = useCallback((newState: boolean) => {
        if (!newState) {
            close();
        }
    }, [close]);

    const renderKidItem = useCallback((kid: WithId<Kid>) => (
        <Select.Item
            key={kid.id}
            value={kid.id.toString()}
        >
            {kid.name}
            {' '}
            {kid.surname}
        </Select.Item>
    ), []);

    const renderCaretakerItem = useCallback((caretaker: WithId<Caretaker>) => (
        <Select.Item
            key={caretaker.id}
            value={caretaker.id.toString()}
        >
            {caretaker.name}
            {' '}
            {caretaker.surname}
        </Select.Item>
    ), []);

    return (
        <Dialog.Root
            open
            onOpenChange={handleClose}
        >
            <Dialog.Content maxWidth="450px">
                <Dialog.Title>{id === null ? 'Nowy urlop rodzicielski' : 'Edycja urlopu rodzicielskiego'}</Dialog.Title>

                <Dialog.Description mb="4">Wprowadź dane urlopu rodzicielskiego.</Dialog.Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        direction="column"
                        gap="3"
                    >
                        <SelectField
                            label="Dziecko"
                            placeholder="Wybierz dziecko"
                            items={kids}
                            renderItem={renderKidItem}
                            control={control}
                            name="kidId"
                            rules={{ required: true }}
                            parseIntValue
                        />

                        <SelectField
                            label="Rodzic"
                            placeholder="Wybierz rodzica"
                            items={caretakers}
                            renderItem={renderCaretakerItem}
                            control={control}
                            name="caretakerId"
                            rules={{ required: true }}
                            parseIntValue
                        />

                        <Box>
                            <DateField
                                label="Data od"
                                control={control}
                                name="dateFrom"
                                rules={{ required: true }}
                            />
                        </Box>

                        <TextField
                            label="Liczba tygodni"
                            control={control}
                            name="weeksCount"
                            rules={{ required: true, pattern: /^\d+$/ }}
                        />

                        <Flex
                            gap="3"
                            justify="end"
                        >
                            <Button
                                loading={isLoading}
                                type="submit"
                            >
                                Zapisz
                            </Button>
                            <Button
                                onClick={close}
                                type="button"
                                variant="soft"
                                disabled={isLoading}
                            >
                                Anuluj
                            </Button>
                        </Flex>
                    </Flex>
                </form>

            </Dialog.Content>
        </Dialog.Root>
    );
};
Component.displayName = 'ParentalLeaveFormDialog';

export const ParentalLeaveFormDialog = memo(withErrorBoundary(Component));

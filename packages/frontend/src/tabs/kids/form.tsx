import { Box, Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { CheckboxField } from '../../components/form/fields/checkboxField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetKidsState, useSaveKidMutation } from '../../redux/apis/kids';
import type { Caretaker, Kid, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const { data: kids = [] } = useGetKidsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [saveKid, { isLoading }] = useSaveKidMutation();

    const { control, handleSubmit, setError } = useForm<Partial<Kid>>({
        defaultValues: useMemo(
            () => kids.find(kid => kid.id === id),
            []
        )
    });

    const onSubmit: SubmitHandler<Partial<Kid>> = async data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const response = await saveKid({ id, ...data as Kid });

        if (response.data) {
            close();
        } else if ('status' in response.error) {
            setError('name', { message: String(response.error.data) });
        } else {
            setError('name', { message: String(response.error.message ?? response.error.name) });
        }
    };

    const handleClose = useCallback((newState: boolean) => {
        if (!newState) {
            close();
        }
    }, [close]);

    const renderCaretakerItem = useCallback((caretaker: WithId<Caretaker>) => (
        <Select.Item
            key={caretaker.id}
            value={caretaker.id.toString()}
        >
            {caretaker.name} {caretaker.surname}
        </Select.Item>
    ), []);

    return (
        <Dialog.Root
            open
            onOpenChange={handleClose}
        >
            <Dialog.Content maxWidth="450px">
                <Dialog.Title>{id === null ? 'Nowe dziecko' : 'Edycja dziecka'}</Dialog.Title>

                <Dialog.Description mb="4">Wprowadź dane dziecka.</Dialog.Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        direction="column"
                        gap="3"
                    >
                        <Flex gap="3">
                            <Box flexGrow="1">
                                <TextField
                                    label="Imię"
                                    control={control}
                                    name="name"
                                    rules={{ required: true }}
                                />
                            </Box>
                            <Box flexGrow="1">
                                <TextField
                                    label="Nazwisko"
                                    control={control}
                                    name="surname"
                                    rules={{ required: true }}
                                />
                            </Box>
                        </Flex>

                        <TextField
                            label="PESEL"
                            control={control}
                            name="pesel"
                            rules={{ required: true, minLength: 11, maxLength: 11 }}
                        />

                        <CheckboxField
                            label="Niepełnosprawność"
                            control={control}
                            name="disabled"
                        />

                        <Flex gap="3">
                            <Box flexGrow="1">
                                <SelectField
                                    label="Matka"
                                    placeholder="Wybierz osobę"
                                    items={caretakers}
                                    renderItem={renderCaretakerItem}
                                    control={control}
                                    name="motherId"
                                    rules={{ required: true }}
                                    parseIntValue
                                />
                            </Box>
                            <Box flexGrow="1">
                                <SelectField
                                    label="Ojciec"
                                    placeholder="Wybierz osobę"
                                    items={caretakers}
                                    renderItem={renderCaretakerItem}
                                    control={control}
                                    name="fatherId"
                                    rules={{ required: true }}
                                    parseIntValue
                                />
                            </Box>
                        </Flex>

                        <TextField
                            label="Notatki"
                            control={control}
                            name="notes"
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
Component.displayName = 'KidFormDialog';

export const KidFormDialog = memo(withErrorBoundary(Component));

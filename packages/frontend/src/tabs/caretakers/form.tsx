import { Box, Button, Dialog, Flex, Separator } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import type { Caretaker, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const { caretakers: { data: caretakers, update: storeCaretaker } } = useData();

    const { control, handleSubmit } = useForm<Partial<Caretaker>>({
        defaultValues: useMemo(
            () => caretakers.find(caretaker => caretaker.id === id),
            []
        )
    });

    const { create, update, isSaving } = usePost(ApiEndpoint.CARETAKERS);

    const onSubmit: SubmitHandler<Partial<Caretaker>> = async data => {
        const response = await (id === null ? create(data) : update(id, data));

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as WithId<Caretaker>;
            if (result.id) {
                storeCaretaker(result);
            }
            close();
        }
    };

    const handleClose = useCallback((newState: boolean) => {
        if (!newState) {
            close();
        }
    }, [close]);

    return (
        <Dialog.Root
            open
            onOpenChange={handleClose}
        >
            <Dialog.Content maxWidth="450px">
                <Dialog.Title>{id === null ? 'Nowy opiekun' : 'Edycja opiekuna'}</Dialog.Title>

                <Dialog.Description mb="4">Wprowadź dane opiekuna.</Dialog.Description>

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

                        <Separator size="4" />

                        <TextField
                            label="Ulica"
                            control={control}
                            name="street"
                            rules={{ required: true }}
                        />

                        <Flex gap="3">
                            <Box flexGrow="1">
                                <TextField
                                    label="Numer ulicy"
                                    control={control}
                                    name="streetNo"
                                    rules={{ required: true }}
                                />
                            </Box>
                            <Box flexGrow="1">
                                <TextField
                                    label="Numer mieszkania"
                                    control={control}
                                    name="flatNo"
                                />
                            </Box>
                        </Flex>

                        <Flex gap="3">
                            <Box flexGrow="1">
                                <TextField
                                    label="Kod pocztowy"
                                    control={control}
                                    name="zipCode"
                                    rules={{
                                        required: true,
                                        validate: (value?: string) => (/^\d\d-\d\d\d$/.test(value ?? '') ? true : 'Błędny format')
                                    }}
                                />
                            </Box>
                            <Box flexGrow="1">
                                <TextField
                                    label="Miasto"
                                    control={control}
                                    name="city"
                                    rules={{ required: true }}
                                />
                            </Box>
                        </Flex>

                        <Separator size="4" />

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
                                loading={isSaving}
                                type="submit"
                            >
                                Zapisz
                            </Button>
                            <Button
                                onClick={close}
                                type="button"
                                variant="soft"
                                disabled={isSaving}
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
Component.displayName = 'CaretakerFormDialog';

export const CaretakerFormDialog = memo(withErrorBoundary(Component));

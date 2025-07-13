import { Box, Button, Dialog, Flex, Separator } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import { TextField } from '../../form/fields/textField';
import type { Caretaker, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const { caretakers: { data: caretakers, update: storeCaretaker } } = useData();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Partial<Caretaker>>({
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
        <div>
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
                                        error={errors.name}
                                        register={register('name', { required: true })}
                                        value={useWatch({ control, name: 'name' })}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <TextField
                                        label="Nazwisko"
                                        error={errors.surname}
                                        register={register('surname', { required: true })}
                                        value={useWatch({ control, name: 'surname' })}
                                    />
                                </Box>
                            </Flex>

                            <TextField
                                label="PESEL"
                                error={errors.pesel}
                                register={register('pesel', { required: true, minLength: 11, maxLength: 11 })}
                                value={useWatch({ control, name: 'pesel' })}
                            />

                            <Separator size="4" />

                            <TextField
                                label="Ulica"
                                error={errors.street}
                                register={register('street', { required: true })}
                                value={useWatch({ control, name: 'street' })}
                            />

                            <Flex gap="3">
                                <Box flexGrow="1">
                                    <TextField
                                        label="Numer ulicy"
                                        error={errors.streetNo}
                                        register={register('streetNo', { required: true })}
                                        value={useWatch({ control, name: 'streetNo' })}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <TextField
                                        label="Numer mieszkania"
                                        error={errors.flatNo}
                                        register={register('flatNo')}
                                        value={useWatch({ control, name: 'flatNo' })}
                                    />
                                </Box>
                            </Flex>

                            <Flex gap="3">
                                <Box flexGrow="1">
                                    <TextField
                                        label="Kod pocztowy"
                                        error={errors.zipCode}
                                        register={register('zipCode', {
                                            required: true,
                                            validate: (value?: string) => (/^\d\d-\d\d\d$/.test(value ?? '') ? true : 'Błędny format')
                                        })}
                                        value={useWatch({ control, name: 'zipCode' })}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <TextField
                                        label="Miasto"
                                        error={errors.city}
                                        register={register('city', { required: true })}
                                        value={useWatch({ control, name: 'city' })}
                                    />
                                </Box>
                            </Flex>

                            <Separator size="4" />

                            <TextField
                                label="Notatki"
                                error={errors.notes}
                                register={register('notes')}
                                value={useWatch({ control, name: 'notes' })}
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
        </div>
    );
};
Component.displayName = 'CaretakerFormDialog';

export const CaretakerFormDialog = memo(Component);

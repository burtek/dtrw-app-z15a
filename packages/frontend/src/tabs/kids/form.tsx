import { Box, Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import { CheckboxField } from '../../form/fields/checkboxField';
import { SelectField } from '../../form/fields/selectField';
import { TextField } from '../../form/fields/textField';
import type { Caretaker, Kid, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        kids: { data: kids, update: storeKid },
        caretakers: { data: caretakers }
    } = useData();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Partial<Kid>>({
        defaultValues: useMemo(
            () => kids.find(kid => kid.id === id),
            []
        )
    });

    const { create, update, isSaving } = usePost(ApiEndpoint.KIDS);

    const onSubmit: SubmitHandler<Partial<Kid>> = async data => {
        const response = await (id === null ? create(data) : update(id, data));

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as WithId<Kid>;
            if (result.id) {
                storeKid(result);
            }
            close();
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
        <div>
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
                                        error={errors.name?.message ?? errors.name?.type}
                                        register={register('name', { required: true })}
                                        value={useWatch({ control, name: 'name' })}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <TextField
                                        label="Nazwisko"
                                        error={errors.surname?.message ?? errors.surname?.type}
                                        register={register('surname', { required: true })}
                                        value={useWatch({ control, name: 'surname' })}
                                    />
                                </Box>
                            </Flex>

                            <TextField
                                label="PESEL"
                                error={errors.pesel?.message ?? errors.pesel?.type}
                                register={register('pesel', { required: true, minLength: 11, maxLength: 11 })}
                                value={useWatch({ control, name: 'pesel' })}
                            />

                            <CheckboxField
                                label="Niepełnosprawność"
                                error={errors.disabled?.message ?? errors.disabled?.type}
                                register={register('disabled')}
                                checked={useWatch({ control, name: 'disabled' })}
                            />

                            <Flex gap="3">
                                <Box flexGrow="1">
                                    <SelectField
                                        label="Matka"
                                        error={errors.motherId?.message ?? errors.motherId?.type}
                                        register={register('motherId', { required: true })}
                                        items={caretakers}
                                        renderItem={renderCaretakerItem}
                                        value={useWatch({ control, name: 'motherId' })?.toString()}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <SelectField
                                        label="Ojciec"
                                        error={errors.fatherId?.message ?? errors.fatherId?.type}
                                        register={register('fatherId', { required: true })}
                                        items={caretakers}
                                        renderItem={renderCaretakerItem}
                                        value={useWatch({ control, name: 'fatherId' })?.toString()}
                                    />
                                </Box>
                            </Flex>

                            <TextField
                                label="Notatki"
                                error={errors.notes?.message ?? errors.notes?.type}
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
Component.displayName = 'KidFormDialog';

export const KidFormDialog = memo(Component);

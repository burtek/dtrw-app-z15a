import { Box, Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { CheckboxField } from '../../components/form/fields/checkboxField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import type { Caretaker, Kid, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        kids: { data: kids, update: storeKid },
        caretakers: { data: caretakers }
    } = useData();

    const { control, handleSubmit } = useForm<Partial<Kid>>({
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
Component.displayName = 'KidFormDialog';

export const KidFormDialog = memo(withErrorBoundary(Component));

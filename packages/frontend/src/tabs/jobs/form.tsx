import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes';
import { memo, useCallback, useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { DateField } from '../../components/form/fields/dateField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import type { Caretaker, Job, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        caretakers: { data: caretakers },
        jobs: { data: jobs, update: storeJob }
    } = useData();

    const { control, handleSubmit } = useForm<Partial<Job>>({
        defaultValues: useMemo(
            () => jobs.find(job => job.id === id),
            []
        )
    });

    const [errorsFromApi, setErrorsFromApi] = useState<string[]>();

    const { create, update, isSaving } = usePost(ApiEndpoint.JOBS);

    const onSubmit: SubmitHandler<Partial<Job>> = async data => {
        setErrorsFromApi(undefined);
        const response = await (id === null ? create(data) : update(id, data));

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as WithId<Job>;
            if (result.id) {
                storeJob(result);
            }
            close();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as { message: string[] };
            setErrorsFromApi(result.message);
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
                <Dialog.Title>{id === null ? 'Nowy płatnik' : 'Edycja płatnika'}</Dialog.Title>

                <Dialog.Description mb="4">Wprowadź dane płatnika.</Dialog.Description>

                {errorsFromApi?.length
                    ? (
                        <Text
                            color="red"
                            mb="4"
                            size="2"
                            style={{ display: 'inline-block' }}
                        >
                            Znaleziono błędy:
                            <ul>
                                {errorsFromApi.map(text => <li key={text}>{text}</li>)}
                            </ul>
                        </Text>
                    )
                    : null}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        direction="column"
                        gap="3"
                    >
                        <TextField
                            label="Nazwa płatnika"
                            control={control}
                            name="company"
                            rules={{ minLength: 3 }}
                        />

                        <TextField
                            label="NIP"
                            control={control}
                            name="nip"
                            rules={{ required: true, minLength: 10, maxLength: 10 }}
                        />

                        <SelectField
                            label="Pracownik"
                            placeholder="Wybierz osobę"
                            items={caretakers}
                            renderItem={renderCaretakerItem}
                            control={control}
                            name="caretakerId"
                            rules={{ required: true }}
                            parseIntValue
                        />

                        <DateField
                            label="Praca od"
                            control={control}
                            name="from"
                            rules={{ max: useWatch({ control, name: 'to' }) ?? undefined }}
                        />
                        <DateField
                            label="Praca do"
                            control={control}
                            name="to"
                            rules={{ min: useWatch({ control, name: 'from' }) ?? undefined }}
                        />

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
Component.displayName = 'JobFormDialog';

export const JobFormDialog = memo(withErrorBoundary(Component));

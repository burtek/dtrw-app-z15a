import { Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import { DateField } from '../../form/fields/dateField';
import { SelectField } from '../../form/fields/selectField';
import { TextField } from '../../form/fields/textField';
import type { Caretaker, Job, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        caretakers: { data: caretakers },
        jobs: { data: jobs, update: storeJob }
    } = useData();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Partial<Job>>({
        defaultValues: useMemo(
            () => jobs.find(job => job.id === id),
            []
        )
    });

    const { create, update, isSaving } = usePost(ApiEndpoint.JOBS);

    const onSubmit: SubmitHandler<Partial<Job>> = async data => {
        const response = await (id === null ? create(data) : update(id, data));

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as WithId<Job>;
            if (result.id) {
                storeJob(result);
            }
            close();
        }
    };

    const dateFrom = useWatch({ control, name: 'from' }) ?? undefined;
    const dateTo = useWatch({ control, name: 'to' }) ?? undefined;

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

    const dateSaveAs = useCallback((date: string) => (date ? new Date(date).toISOString().split('T')[0] : ''), []);

    return (
        <div>
            <Dialog.Root
                open
                onOpenChange={handleClose}
            >
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>{id === null ? 'Nowy płatnik' : 'Edycja płatnika'}</Dialog.Title>

                    <Dialog.Description mb="4">Wprowadź dane płatnika.</Dialog.Description>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex
                            direction="column"
                            gap="3"
                        >
                            <TextField
                                label="Nazwa płatnika"
                                error={errors.company}
                                register={register('company', { minLength: 3 })}
                                value={useWatch({ control, name: 'company' })}
                            />

                            <TextField
                                label="NIP"
                                error={errors.nip}
                                register={register('nip', { required: true, minLength: 10, maxLength: 10 })}
                                value={useWatch({ control, name: 'nip' })}
                            />

                            <SelectField
                                label="Pracownik"
                                error={errors.caretakerId}
                                register={register('caretakerId', { required: true })}
                                items={caretakers}
                                renderItem={renderCaretakerItem}
                                value={useWatch({ control, name: 'caretakerId' })?.toString()}
                            />

                            <DateField
                                label="Praca od"
                                error={errors.from}
                                register={register('from', {
                                    setValueAs: dateSaveAs,
                                    max: dateTo
                                })}
                            />
                            <DateField
                                label="Praca do"
                                error={errors.to}
                                register={register('to', {
                                    setValueAs: dateSaveAs,
                                    min: dateFrom
                                })}
                            />

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
Component.displayName = 'JobFormDialog';

export const JobFormDialog = memo(Component);

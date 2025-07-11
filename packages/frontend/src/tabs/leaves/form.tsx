import { Box, Button, Dialog, Flex, Select, Separator } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import { CalendarField } from '../../form/fields/calendarField';
import { DateField } from '../../form/fields/dateField';
import { SelectField } from '../../form/fields/selectField';
import { TextField } from '../../form/fields/textField';
import type { Job, Kid, Leave, WithId } from '../../types';

import styles from './styles.module.css';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        kids: { data: kids },
        jobs: { data: jobs },
        caretakers: { data: caretakers },
        leaves: { data: leaves, update: storeLeave }
    } = useData();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Partial<Leave>>({
        defaultValues: useMemo(
            () => leaves.find(leave => leave.id === id) ?? { daysTaken: [] },
            []
        )
    });

    const { create, update, isSaving } = usePost(ApiEndpoint.LEAVES);

    const onSubmit: SubmitHandler<Partial<Leave>> = async data => {
        const response = await (id === null ? create(data) : update(id, data));

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            const result = await response.json() as WithId<Leave>;
            if (result.id) {
                storeLeave(result);
            }
            close();
        }
    };

    const dateFrom = useWatch({ control, name: 'from' });
    const dateTo = useWatch({ control, name: 'to' });
    const daysTaken = useWatch({ control, name: 'daysTaken' });

    const handleClose = useCallback((newState: boolean) => {
        if (!newState) {
            close();
        }
    }, [close]);

    const renderJobItem = useCallback((job: WithId<Job>) => {
        const caretaker = caretakers.find(c => c.id === job.caretakerId);
        return (
            <Select.Item
                key={job.id}
                value={job.id.toString()}
                className={styles.hackEllipsis}
            >
                {caretaker ? `${caretaker.name} ${caretaker.surname}` : '?'} - {job.company}
            </Select.Item>
        );
    }, [caretakers]);

    const renderKidItem = useCallback((kid: WithId<Kid>) => (
        <Select.Item
            key={kid.id}
            value={kid.id.toString()}
        >
            {kid.name} {kid.surname}
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
                    <Dialog.Title>{id === null ? 'Nowe zwolnienie' : 'Edycja zwolnienia'}</Dialog.Title>

                    <Dialog.Description mb="4">Wprowadź dane zwolnienia.</Dialog.Description>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex
                            direction="column"
                            gap="3"
                        >
                            <SelectField
                                label="Pracownik / Płatnik ZUS"
                                error={errors.jobId?.message ?? errors.jobId?.type}
                                register={register('jobId', { required: true })}
                                items={jobs}
                                renderItem={renderJobItem}
                                value={useWatch({ control, name: 'jobId' })?.toString()}
                            />

                            <Flex gap="3">
                                <Box flexGrow="1">
                                    <TextField
                                        label="Numer ZLA"
                                        error={errors.zla?.message ?? errors.zla?.type}
                                        register={register('zla', {
                                            minLength: 9,
                                            maxLength: 9
                                        })}
                                        value={useWatch({ control, name: 'zla' })}
                                    />
                                </Box>
                                <Box flexGrow="1">
                                    <SelectField
                                        label="Dziecko"
                                        error={errors.kidId?.message ?? errors.kidId?.type}
                                        register={register('kidId', { required: true })}
                                        items={kids}
                                        renderItem={renderKidItem}
                                        value={useWatch({ control, name: 'kidId' })?.toString()}
                                    />
                                </Box>
                            </Flex>

                            <Separator size="4" />

                            <DateField
                                label="Zwolnienie od"
                                error={errors.from?.message ?? errors.from?.type}
                                register={register('from', {
                                    required: true,
                                    setValueAs: dateSaveAs,
                                    max: dateTo
                                })}
                            />
                            <DateField
                                label="Zwolnienie do"
                                error={errors.to?.message ?? errors.to?.type}
                                register={register('to', {
                                    required: true,
                                    setValueAs: dateSaveAs,
                                    min: dateFrom
                                })}
                            />

                            <CalendarField
                                label="Dni nieobecności"
                                error={errors.daysTaken?.message ?? errors.daysTaken?.type}
                                {...register('daysTaken', { validate: value => (value && value.length > 0 ? true : 'Wybierz przynajmniej jeden dzień') })}
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                value={daysTaken}
                            />

                            <Separator size="4" />

                            <TextField
                                label="Uwagi w Z-15A"
                                error={errors.z15aNotes?.message ?? errors.z15aNotes?.type}
                                register={register('z15aNotes')}
                                value={useWatch({ control, name: 'z15aNotes' })}
                            />
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
Component.displayName = 'LeaveFormDialog';

export const LeaveFormDialog = memo(Component);

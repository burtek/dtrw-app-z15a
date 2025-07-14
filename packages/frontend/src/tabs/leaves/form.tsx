import { Box, Button, Dialog, Flex, Select, Separator } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { CalendarField } from '../../components/form/fields/calendarField';
import { DateField } from '../../components/form/fields/dateField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { ApiEndpoint, usePost } from '../../data/apiHooks';
import { useData } from '../../data/provider';
import type { Job, Kid, Leave, WithId } from '../../types';

import styles from './styles.module.css';
import type { FormLeave } from './transform';
import { leaveTransformer } from './transform';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const {
        kids: { data: kids },
        jobs: { data: jobs },
        caretakers: { data: caretakers },
        leaves: { data: leaves, update: storeLeave }
    } = useData();

    const { control, handleSubmit } = useForm<Partial<FormLeave>>({
        defaultValues: useMemo(
            () => {
                const leave = leaves.find(l => l.id === id);
                return leave ? leaveTransformer.fromApi(leave) : { daysTaken: {} };
            },
            []
        )
    });

    const { create, update, isSaving } = usePost(ApiEndpoint.LEAVES);

    const onSubmit: SubmitHandler<Partial<FormLeave>> = async data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const parsedData = leaveTransformer.toApi(data as FormLeave);

        const response = await (id === null ? create(parsedData) : update(id, parsedData));

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

    return (
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
                            items={jobs}
                            renderItem={renderJobItem}
                            control={control}
                            name="jobId"
                            rules={{ required: true }}
                            parseIntValue
                        />

                        <Flex gap="3">
                            <Box flexGrow="1">
                                <TextField
                                    label="Numer ZLA"
                                    control={control}
                                    name="zla"
                                    rules={{ minLength: 9, maxLength: 9 }}
                                />
                            </Box>
                            <Box flexGrow="1">
                                <SelectField
                                    label="Dziecko"
                                    items={kids}
                                    renderItem={renderKidItem}
                                    control={control}
                                    name="kidId"
                                    rules={{ required: true }}
                                    parseIntValue
                                />
                            </Box>
                        </Flex>

                        <Separator size="4" />

                        <DateField
                            label="Zwolnienie od"
                            control={control}
                            name="from"
                            rules={{ required: true, max: dateTo }}
                        />
                        <DateField
                            label="Zwolnienie do"
                            control={control}
                            name="to"
                            rules={{ required: true, min: dateFrom }}
                        />

                        <CalendarField
                            label="Dni nieobecności"
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            control={control}
                            name="daysTaken"
                            rules={{
                                validate(value = {}) {
                                    return Object.keys(value).some(key => value[key]) || 'Wybierz przynajmniej jeden dzień';
                                }
                            }}
                        />

                        <Separator size="4" />

                        <TextField
                            label="Uwagi w Z-15A"
                            control={control}
                            name="z15aNotes"
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
Component.displayName = 'LeaveFormDialog';

export const LeaveFormDialog = memo(withErrorBoundary(Component));

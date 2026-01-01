import { Button, Dialog, Flex, Select } from '@radix-ui/themes';
import { memo, useCallback, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { DateField } from '../../components/form/fields/dateField';
import { SelectField } from '../../components/form/fields/selectField';
import { TextField } from '../../components/form/fields/textField';
import { withErrorBoundary } from '../../components/withErrorBoundary';
import { useGetCaretakersState } from '../../redux/apis/caretakers';
import { useGetJobsState, useSaveJobMutation } from '../../redux/apis/jobs';
import type { Caretaker, Job, WithId } from '../../types';


const Component = ({ close, id }: { close: () => void; id: number | null }) => {
    const { data: jobs = [] } = useGetJobsState();
    const { data: caretakers = [] } = useGetCaretakersState();

    const [saveJob, { isLoading }] = useSaveJobMutation();

    const { control, handleSubmit, setError } = useForm<Partial<Job>>({
        defaultValues: useMemo(
            () => jobs.find(job => job.id === id),
            []
        )
    });

    const onSubmit: SubmitHandler<Partial<Job>> = async data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/prefer-nullish-coalescing
        const response = await saveJob({ id, ...data as Job, from: data.from || null, to: data.to || null });

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
            setError('company', { message });
        } else {
            setError('company', { message: String(response.error.message ?? response.error.name) });
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
                <Dialog.Title>{id === null ? 'Nowy płatnik' : 'Edycja płatnika'}</Dialog.Title>

                <Dialog.Description mb="4">Wprowadź dane płatnika.</Dialog.Description>

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
Component.displayName = 'JobFormDialog';

export const JobFormDialog = memo(withErrorBoundary(Component));

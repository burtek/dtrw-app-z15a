import { render, screen } from '@testing-library/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';

import { CalendarField } from './calendarField';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Data = {
    dateFrom?: string;
    dateTo?: string;
    daysTaken: Record<string, boolean>;
};

const TestFormComponent = ({
    onSubmit,
    defaultValues
}: {
    onSubmit: SubmitHandler<Data>;
    defaultValues?: Partial<Data>;
}) => {
    const { control, register, handleSubmit } = useForm<Data>({ defaultValues });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="dateFrom">Data od:</label>
            <input
                id="dateFrom"
                type="date"
                {...register('dateFrom')}
            />
            <label htmlFor="dateFrom">Data do:</label>
            <input
                id="dateTo"
                type="date"
                {...register('dateTo')}
            />
            <CalendarField<Data>
                label="Kalendarz"
                control={control}
                name="daysTaken"
                dateFrom={useWatch({ control, name: 'dateFrom' })}
                dateTo={useWatch({ control, name: 'dateTo' })}
            />
        </form>
    );
};

describe('components/form/fields/calendarField', () => {
    it('should render checkboxes', () => {
        const handleSubmit = vitest.fn();
        render(
            <TestFormComponent
                onSubmit={handleSubmit}
                defaultValues={{
                    dateFrom: '2025-04-01',
                    dateTo: '2025-04-05'
                }}
            />
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    });
});

import { Checkbox } from '@radix-ui/themes';
import { memo, useEffect, useMemo, useRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import type { FieldWrapperProps } from './_wrapper';
import { FieldWrapper } from './_wrapper';


function getDateRange(from?: string, to?: string): string[] {
    if (!from || !to) {
        return [];
    }

    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return [];
    }

    const dates = [];
    // eslint-disable-next-line no-unmodified-loop-condition -- false positive
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

const useCalendar = (dateRange: string[]) => useMemo(() => {
    if (dateRange.length === 0 || dateRange.length > 21) {
        return [];
    }

    const prefill = (new Date(dateRange[0]).getDay() || 7) - 1;
    const result = [
        ...Array.from({ length: prefill }, () => ''),
        ...dateRange,
        ...Array.from({ length: (7 - ((prefill + dateRange.length) % 7)) % 7 }, () => '')
    ];

    return result.reduce<string[][]>((acc, curr, index) => {
        if (index % 7 === 0) {
            acc.push([]);
        }
        acc.at(-1)?.push(curr);
        return acc;
    }, []);
}, [dateRange]);

const usePrevious = <T,>(value: T) => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

const monthFormatter = new Intl.DateTimeFormat('pl', { month: 'long' });

const Component = ({ label, error, dateFrom, dateTo, ...register }: UseFormRegisterReturn & FieldWrapperProps & Props) => {
    const { value = [], disabled, name, onChange, required } = register; // ref unused!

    const dateRange = useMemo(() => getDateRange(dateFrom, dateTo), [dateFrom, dateTo]);
    const previousDateRange = usePrevious(dateRange);
    const calendar = useCalendar(dateRange);

    useEffect(() => {
        const newDays = dateRange.filter(d => !previousDateRange.includes(d));
        if (newDays.length === 0 || disabled) {
            return;
        }
        void onChange({
            target: {
                name,
                value: [...value, ...newDays].sort()
            },
            type: 'change'
        });
    }, [dateRange]);

    const handleChange = (date: string, checked: boolean) => onChange({
        target: {
            name,
            value: checked
                ? [...new Set([...value, date])].sort()
                : value.filter(d => d !== date)
        },
        type: 'change'
    });

    const renderWeekDay = (date: string, index: number) => {
        if (!date) {
            return <td key={index} />;
        }
        return (
            <td
                key={index}
                style={{ textAlign: 'center' }}
            >
                <span style={{ color: new Date(date).getDay() % 6 === 0 ? 'red' : undefined }}>
                    {new Date(date).getDate()}
                    {' '}
                    <Checkbox
                        required={required}
                        disabled={disabled}
                        checked={value.includes(date)}
                        // eslint-disable-next-line react/jsx-no-bind
                        onCheckedChange={checked => handleChange(date, checked === true)}
                    />
                </span>
            </td>
        );
    };

    const renderWeek = (week: string[], index: number) => (
        <tr key={index}>
            <td style={{ textAlign: 'center' }}>
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                {monthFormatter.format(new Date(week.find(date => date)!))}
            </td>
            {week.map(renderWeekDay)}
        </tr>
    );

    return (
        <FieldWrapper
            label={label}
            error={error}
            as="div"
        >
            <table>
                <thead>
                    <tr>
                        <td style={{ textAlign: 'center', width: '1.5em' }} />
                        <td style={{ textAlign: 'center', width: '1.5em' }}>P</td>
                        <td style={{ textAlign: 'center', width: '1.5em' }}>W</td>
                        <td style={{ textAlign: 'center', width: '1.5em' }}>Ś</td>
                        <td style={{ textAlign: 'center', width: '1.5em' }}>C</td>
                        <td style={{ textAlign: 'center', width: '1.5em' }}>P</td>
                        <td style={{ textAlign: 'center', width: '1.5em', color: 'red' }}>S</td>
                        <td style={{ textAlign: 'center', width: '1.5em', color: 'red' }}>N</td>
                    </tr>
                </thead>
                <tbody>
                    {calendar.map(renderWeek)}
                </tbody>
            </table>
        </FieldWrapper>
    );
};
Component.displayName = 'CalendarField';

export const CalendarField = memo(Component);

interface Props {
    dateFrom?: string;
    dateTo?: string;
    value?: string[];
}

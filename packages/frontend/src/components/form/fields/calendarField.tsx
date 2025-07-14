import { Checkbox } from '@radix-ui/themes';
import { memo, useEffect, useMemo } from 'react';
import type { Control, Validate } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { FieldWrapper } from './_wrapper';


export function getDateRange(from?: string, to?: string): string[] {
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

function checkValueType(value: unknown): asserts value is Record<string, boolean> | undefined {
    if (!['object', 'undefined'].includes(typeof value)) {
        throw new TypeError(`value should be object|undefined, ${typeof value} given instead`);
    }
}

const monthFormatter = new Intl.DateTimeFormat('pl', { month: 'long' });
const Component = <C extends Control>({ label, control, name, rules, dateFrom, dateTo }: Props<C>) => {
    const {
        field: { value: v, onChange, disabled }, // ref unused!
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({ control, name, rules });
    const value = v as unknown;
    checkValueType(value);

    const dateRange = useMemo(() => getDateRange(dateFrom, dateTo), [dateFrom, dateTo]);
    const calendar = useCalendar(dateRange);

    useEffect(() => {
        const newValue = { ...value };
        let changed: boolean = false;
        Object.keys(newValue).forEach(key => {
            if (!dateRange.includes(key)) {
                delete newValue[key];
                changed = true;
            }
        });
        dateRange.forEach(key => {
            if (!(key in newValue)) {
                newValue[key] = true;
                changed = true;
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
        if (!changed || isSubmitting || disabled) {
            return;
        }
        onChange(newValue);
    }, [dateRange, disabled, isSubmitting, onChange, value]);

    const handleChange = (date: string, checked: boolean) => {
        if (dateRange.includes(date)) {
            onChange({
                ...value,
                [date]: checked
            });
        }
    };

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
                        required={rules?.required}
                        disabled={isSubmitting || disabled}
                        checked={value?.[date] ?? false}
                        // eslint-disable-next-line react/jsx-no-bind
                        onCheckedChange={checked => {
                            handleChange(date, checked === true);
                        }}
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

interface Props<C extends Control> {
    dateFrom?: string;
    dateTo?: string;

    label: string;

    control: C;
    name: C extends Control<infer Values> ? keyof Values : string;
    rules?: {
        required?: boolean;
        validate?: C extends Control<infer Values> ? Validate<Record<string, boolean> | undefined, Values> : never;
    };
}

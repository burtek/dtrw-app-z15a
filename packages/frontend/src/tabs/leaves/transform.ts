import { getDateRange } from '../../components/form/fields/calendarField';
import type { Leave } from '../../types';


export const leaveTransformer = {
    fromApi(leave: Leave): FormLeave {
        return {
            ...leave,
            daysTaken: getDateRange(leave.from, leave.to)
                .reduce<Record<string, boolean>>(
                    (acc, date) => ({ ...acc, [date]: leave.daysTaken.includes(date) }),
                    {}
                )
        };
    },
    toApi(leave: FormLeave): Leave {
        return {
            ...leave,
            daysTaken: Object.entries(leave.daysTaken)
                .filter(([, value]) => value)
                .map(([date]) => date)
        };
    }
};

export type FormLeave = Omit<Leave, 'daysTaken'> & { daysTaken: Record<string, boolean> };

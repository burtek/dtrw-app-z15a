import { rangesCollide } from '../dateRange/dateRange';
import type { PlainDate } from '../schemas/plainDate';

import { Z15A_FIELDS_MAP } from './fieldsMap';
import type { Job, LeaveWithData } from './pdf.service';


export const Z15A_FIELD_RESOLVERS: Record<string, (leave: LeaveWithData, jobs: Job[]) => Record<string, boolean | string>> = {
    basicData: leave => {
        const kidDob = new Date(`${leave.kid.pesel.substring(0, 4)}-${leave.kid.pesel.substring(4, 6)}-${leave.kid.pesel.substring(6, 8)}`);

        const otherParent = leave.job.caretakerId === leave.kid.mother.id ? leave.kid.father : leave.kid.mother;

        const isKidAge = (age: number) => {
            const dateKidAtAge = new Date(kidDob);
            dateKidAtAge.setFullYear(kidDob.getFullYear() + age);

            return dateKidAtAge < new Date(leave.from);
        };

        return {
            [Z15A_FIELDS_MAP.fillee.pesel]: leave.job.caretaker.pesel,
            [Z15A_FIELDS_MAP.fillee.name]: leave.job.caretaker.name,
            [Z15A_FIELDS_MAP.fillee.surname]: leave.job.caretaker.surname,
            [Z15A_FIELDS_MAP.fillee.street]: leave.job.caretaker.street,
            [Z15A_FIELDS_MAP.fillee.streetNo]: leave.job.caretaker.streetNo,
            [Z15A_FIELDS_MAP.fillee.flatNo]: leave.job.caretaker.flatNo ?? '',
            [Z15A_FIELDS_MAP.fillee.zipCode]: leave.job.caretaker.zipCode,
            [Z15A_FIELDS_MAP.fillee.city]: leave.job.caretaker.city,
            [Z15A_FIELDS_MAP.employer.nip]: leave.job.nip,
            [Z15A_FIELDS_MAP.employer.name]: leave.job.company,
            [Z15A_FIELDS_MAP.bankDetails.accountNumber]: leave.job.caretaker.bankAccountNumber ?? '',
            [Z15A_FIELDS_MAP.leaveData.text]: (leave.zla ? `${leave.zla}: ` : '') + datesToRanges(leave.daysTaken),
            [Z15A_FIELDS_MAP.kid.pesel]: leave.kid.pesel,
            [Z15A_FIELDS_MAP.kid.name]: leave.kid.name,
            [Z15A_FIELDS_MAP.kid.surname]: leave.kid.surname,
            [Z15A_FIELDS_MAP.kid.disabled.yes]: false,
            [Z15A_FIELDS_MAP.kid.disabled.no]: true,
            [Z15A_FIELDS_MAP.attestations.otherPersonAvailable.yes]: false,
            [Z15A_FIELDS_MAP.attestations.otherPersonAvailable.no]: true,
            [Z15A_FIELDS_MAP.attestations.shiftWork.yes]: false,
            [Z15A_FIELDS_MAP.attestations.shiftWork.no]: true,
            [Z15A_FIELDS_MAP.attestations.kidOver14InSameHousehold.yes]: isKidAge(14),
            [Z15A_FIELDS_MAP.attestations.kidOver14InSameHousehold.no]: false,
            [Z15A_FIELDS_MAP.otherParent.name]: otherParent.name,
            [Z15A_FIELDS_MAP.otherParent.surname]: otherParent.surname,
            [Z15A_FIELDS_MAP.otherParent.pesel]: otherParent.pesel,
            [Z15A_FIELDS_MAP.footer.date]: `${new Date().getDate()}`.padStart(2, '0') + `${new Date().getMonth() + 1}`.padStart(2, '0') + new Date().getFullYear()
        };
    },
    jobChange: (leave, jobs) => {
        const currentYear = leave.from.substring(0, 4);

        const previousJobsThisYear = jobs
            .filter(
                job => job.caretakerId === leave.job.caretakerId
                    && (!job.from || job.from < leave.from)
                    && (!job.to || job.to.startsWith(currentYear))
                    && job.id !== leave.job.id
                    && (job.to ?? '9999-99-99') < (leave.job.from ?? '0000-00-00')
            );

        if (previousJobsThisYear.length === 0) {
            return { [Z15A_FIELDS_MAP.attestations.changedEmployerAndTookLeave.noChange]: true };
        }

        const prevDays = previousJobsThisYear
            .flatMap(job => job.leaves)
            .flatMap(jobLeave => jobLeave.daysTaken)
            .filter(date => date.startsWith(currentYear))
            .length;

        return {
            [Z15A_FIELDS_MAP.attestations.changedEmployerAndTookLeave.yes]: prevDays > 0,
            [Z15A_FIELDS_MAP.attestations.changedEmployerAndTookLeave.no]: prevDays === 0,
            [Z15A_FIELDS_MAP.attestations.changedEmployerAndTookLeave.kidTo8Or14Check]: prevDays > 0,
            [Z15A_FIELDS_MAP.attestations.changedEmployerAndTookLeave.kidTo8Or14Days]: `${prevDays}`
        };
    },
    otherParentJobChange: (leave, jobs) => {
        const currentYear = leave.from.substring(0, 4);
        const otherParent = leave.job.caretakerId === leave.kid.mother.id ? leave.kid.father : leave.kid.mother;

        const otherParentJobs = jobs
            .filter(job => job.caretakerId === otherParent.id)
            .filter(job => (job.from ?? '0000-00-00') < leave.to);

        const works = otherParentJobs.some(job => rangesCollide(job, leave, true));

        const prevDays = otherParentJobs
            .flatMap(job => job.leaves)
            .flatMap(jobLeave => jobLeave.daysTaken)
            .filter(date => date.startsWith(currentYear) && date < leave.from)
            .length;

        return {
            [Z15A_FIELDS_MAP.otherParentAttestations.works.yes]: works,
            [Z15A_FIELDS_MAP.otherParentAttestations.works.no]: !works,
            [Z15A_FIELDS_MAP.otherParentAttestations.works.shiftNo]: true,
            [Z15A_FIELDS_MAP.otherParentAttestations.tookLeave.yes]: prevDays > 0,
            [Z15A_FIELDS_MAP.otherParentAttestations.tookLeave.no]: prevDays === 0,
            [Z15A_FIELDS_MAP.otherParentAttestations.tookLeave.kidTo8Or14Check]: prevDays > 0,
            [Z15A_FIELDS_MAP.otherParentAttestations.tookLeave.kidTo8Or14Days]: prevDays ? `${prevDays}` : ''
        };
    }
};

function datesToRanges([firstDate, ...dates]: PlainDate[]) {
    const formatter = new Intl.DateTimeFormat('pl', { day: 'numeric', month: 'long', year: 'numeric' });

    const ranges = dates.reduce<[PlainDate, PlainDate][]>((acc, date) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const prevRangeEnd = acc.at(-1)!;
        if (new Date(date).getTime() - new Date(prevRangeEnd[1]).getTime() === 24 * 60 * 60 * 1000) {
            prevRangeEnd[1] = date;
            return acc;
        }
        return [...acc, [date, date]];
    }, [[firstDate, firstDate]]);

    return ranges.map(range => {
        if (range[0] === range[1]) {
            return formatter.format(new Date(range[0]));
        }
        return formatter.formatRange(new Date(range[0]), new Date(range[1]));
    }).join(', ');
}

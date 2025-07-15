import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as fontkit from '@pdf-lib/fontkit';
import { eq } from 'drizzle-orm';
import { PDFDocument, PDFForm } from 'pdf-lib';

import { leaves } from '../database/schemas';
import { rangesCollide } from '../dateRange/dateRange';
import { DrizzleAsyncProvider, DrizzleDb } from '../drizzle/drizzle.provider';
import { PlainDate } from '../validators/plainDate';


// eslint-disable-next-line @typescript-eslint/no-use-before-define
type LeaveWithData = NonNullable<Awaited<ReturnType<PdfService['getLeaveAndJobs']>>>[0];
// eslint-disable-next-line @typescript-eslint/no-use-before-define
type Job = NonNullable<Awaited<ReturnType<PdfService['getLeaveAndJobs']>>>[1][number];

@Injectable()
export class PdfService {
    private static readonly CURRENT_VERSION = '20250707';

    private static readonly KEEP_MAX_PAGES = 5;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static readonly ALL_FIELDS_MAP = {
        fillee: {
            pesel: 'topmostSubform[0].Page1[0].PESEL[0]',
            name: 'topmostSubform[0].Page1[0].Imię[0]',
            surname: 'topmostSubform[0].Page1[0].Nazwisko[0]',
            street: 'topmostSubform[0].Page1[0].Ulica[0]',
            streetNo: 'topmostSubform[0].Page1[0].Numerdomu[0]',
            flatNo: 'topmostSubform[0].Page1[0].Numerlokalu[0]',
            zipCode: 'topmostSubform[0].Page1[0].Kodpocztowy[0]',
            city: 'topmostSubform[0].Page1[0].Miejscowość[0]'
        },
        employer: {
            nip: 'topmostSubform[0].Page2[0].NIP[0]',
            name: 'topmostSubform[0].Page2[0].Nazwapłatnika[0]'
        },
        leaveData: { text: 'topmostSubform[0].Page2[0].Tekst1a[0]' },
        kid: {
            pesel: 'topmostSubform[0].Page2[0].PESEL[0]',
            name: 'topmostSubform[0].Page2[0].Imię[0]',
            surname: 'topmostSubform[0].Page2[0].Nazwisko[0]',
            disabled: {
                yes: 'topmostSubform[0].Page2[0].OrzeczenieTAK[0]',
                no: 'topmostSubform[0].Page2[0].OrzeczenieNIE[0]'
            }
        },
        attestations: {
            otherPersonAvailable: {
                yes: 'topmostSubform[0].Page2[0].Oświadczenie1TAK[0]',
                no: 'topmostSubform[0].Page2[0].Oświadczenie1NIE[0]',
                details: 'topmostSubform[0].Page2[0].Tekst1[0]'
            },
            shiftWork: {
                yes: 'topmostSubform[0].Page2[0].Oświadczenie2TAK[0]',
                no: 'topmostSubform[0].Page2[0].Oświadczenie2NIE[0]',
                details: 'topmostSubform[0].Page2[0].Tekst2[0]'
            },
            kidOver14InSameHousehold: {
                yes: 'topmostSubform[0].Page3[0].Oświadczenie3TAK[0]',
                no: 'topmostSubform[0].Page3[0].Oświadczenie3NIE[0]'
            },
            changedEmployerAndTookLeave: {
                yes: 'topmostSubform[0].Page3[0].Oświadczenie4TAK[0]',
                no: 'topmostSubform[0].Page3[0].Oświadczenie4NIE[0]',
                noChange: 'topmostSubform[0].Page3[0].Oświadczenie4NIEZMIENILEM[0]',
                kidTo8Or14Check: 'topmostSubform[0].Page3[0].ZaznaczX4a[0]',
                kidTo8Or14Days: 'topmostSubform[0].Page3[0].Liczbadni3a[0]',
                kidSickOver14Check: 'topmostSubform[0].Page3[0].ZaznaczX4b[0]',
                kidSickOver14Days: 'topmostSubform[0].Page3[0].Liczbadni3b[0]',
                kidSickOrDisabledCheck: 'topmostSubform[0].Page3[0].ZaznaczX4c[0]',
                kidSickOrDisabledDays: 'topmostSubform[0].Page3[0].Liczbadni3c[0]'
            }
        },
        otherParent: {
            pesel: 'topmostSubform[0].Page3[0].PESEL[0]',
            name: 'topmostSubform[0].Page3[0].Imię[0]',
            surname: 'topmostSubform[0].Page3[0].Nazwisko[0]'
        },
        otherParentAttestations: {
            works: {
                yes: 'topmostSubform[0].Page3[0].Dane1TAK[0]',
                no: 'topmostSubform[0].Page3[0].Dane1NIE[0]',
                shiftYes: 'topmostSubform[0].Page3[0].Dane1BTAK[0]',
                shiftNo: 'topmostSubform[0].Page3[0].Dane1BNIE[0]',
                details: 'topmostSubform[0].Page3[0].Tekst2[0]'
            },
            tookLeave: {
                yes: 'topmostSubform[0].Page3[0].Dane2TAK[0]',
                no: 'topmostSubform[0].Page3[0].Dane2NIE[0]',
                kidTo8Or14Check: 'topmostSubform[0].Page3[0].ZaznaczX2a[0]',
                kidTo8Or14Days: 'topmostSubform[0].Page3[0].Liczbadni2a[0]',
                kidSickOver14Check: 'topmostSubform[0].Page3[0].ZaznaczX2b[0]',
                kidSickOver14Days: 'topmostSubform[0].Page3[0].Liczbadni2b[0]',
                kidSickOrDisabledCheck: 'topmostSubform[0].Page3[0].ZaznaczX2c[0]',
                kidSickOrDisabledDays: 'topmostSubform[0].Page3[0].Liczbadni2c[0]'
            }
        },
        footer: {
            notes: 'topmostSubform[0].Page5[0].Tekst1[0]',
            date: 'topmostSubform[0].Page5[0].Data[0]'
        }
    } satisfies Record<string, Record<string, string | Record<string, string>>>;

    private static readonly FIELDS: Record<string, (leave: LeaveWithData, jobs: Job[]) => Record<string, boolean | string>> = {
        basicData: leave => {
            const kidDob = new Date(`${leave.kid.pesel.substring(0, 4)}-${leave.kid.pesel.substring(4, 6)}-${leave.kid.pesel.substring(6, 8)}`);

            const otherParent = leave.job.caretakerId === leave.kid.mother.id ? leave.kid.father : leave.kid.mother;

            const isKidAge = (age: number) => {
                const dateKidAtAge = new Date(kidDob);
                dateKidAtAge.setFullYear(kidDob.getFullYear() + age);

                return dateKidAtAge < new Date(leave.from);
            };

            return {
                [PdfService.ALL_FIELDS_MAP.fillee.pesel]: leave.job.caretaker.pesel,
                [PdfService.ALL_FIELDS_MAP.fillee.name]: leave.job.caretaker.name,
                [PdfService.ALL_FIELDS_MAP.fillee.surname]: leave.job.caretaker.surname,
                [PdfService.ALL_FIELDS_MAP.fillee.street]: leave.job.caretaker.street,
                [PdfService.ALL_FIELDS_MAP.fillee.streetNo]: leave.job.caretaker.streetNo,
                [PdfService.ALL_FIELDS_MAP.fillee.flatNo]: leave.job.caretaker.flatNo ?? '',
                [PdfService.ALL_FIELDS_MAP.fillee.zipCode]: leave.job.caretaker.zipCode,
                [PdfService.ALL_FIELDS_MAP.fillee.city]: leave.job.caretaker.city,
                [PdfService.ALL_FIELDS_MAP.employer.nip]: leave.job.nip,
                [PdfService.ALL_FIELDS_MAP.employer.name]: leave.job.company,
                [PdfService.ALL_FIELDS_MAP.leaveData.text]: (leave.zla ? `${leave.zla}: ` : '') + PdfService.datesToRanges(leave.daysTaken),
                [PdfService.ALL_FIELDS_MAP.kid.pesel]: leave.kid.pesel,
                [PdfService.ALL_FIELDS_MAP.kid.name]: leave.kid.name,
                [PdfService.ALL_FIELDS_MAP.kid.surname]: leave.kid.surname,
                [PdfService.ALL_FIELDS_MAP.kid.disabled.yes]: false,
                [PdfService.ALL_FIELDS_MAP.kid.disabled.no]: true,
                [PdfService.ALL_FIELDS_MAP.attestations.otherPersonAvailable.yes]: false,
                [PdfService.ALL_FIELDS_MAP.attestations.otherPersonAvailable.no]: true,
                [PdfService.ALL_FIELDS_MAP.attestations.shiftWork.yes]: false,
                [PdfService.ALL_FIELDS_MAP.attestations.shiftWork.no]: true,
                [PdfService.ALL_FIELDS_MAP.attestations.kidOver14InSameHousehold.yes]: isKidAge(14),
                [PdfService.ALL_FIELDS_MAP.attestations.kidOver14InSameHousehold.no]: false,
                [PdfService.ALL_FIELDS_MAP.otherParent.name]: otherParent.name,
                [PdfService.ALL_FIELDS_MAP.otherParent.surname]: otherParent.surname,
                [PdfService.ALL_FIELDS_MAP.otherParent.pesel]: otherParent.pesel,
                [PdfService.ALL_FIELDS_MAP.footer.date]: `${new Date().getDate()}`.padStart(2, '0') + `${new Date().getMonth() + 1}`.padStart(2, '0') + new Date().getFullYear()
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
                return { [PdfService.ALL_FIELDS_MAP.attestations.changedEmployerAndTookLeave.noChange]: true };
            }

            const prevDays = previousJobsThisYear
                .flatMap(job => job.leaves)
                .flatMap(jobLeave => jobLeave.daysTaken)
                .filter(date => date.startsWith(currentYear))
                .length;

            return {
                [PdfService.ALL_FIELDS_MAP.attestations.changedEmployerAndTookLeave.yes]: prevDays > 0,
                [PdfService.ALL_FIELDS_MAP.attestations.changedEmployerAndTookLeave.no]: prevDays === 0,
                [PdfService.ALL_FIELDS_MAP.attestations.changedEmployerAndTookLeave.kidTo8Or14Check]: prevDays > 0,
                [PdfService.ALL_FIELDS_MAP.attestations.changedEmployerAndTookLeave.kidTo8Or14Days]: `${prevDays}`
            };
        },
        otherParentJobChange: (leave, jobs) => {
            const currentYear = leave.from.substring(0, 4);
            const otherParent = leave.job.caretakerId === leave.kid.mother.id ? leave.kid.father : leave.kid.mother;

            const otherParentJobs = jobs
                .filter(job => job.caretakerId === otherParent.id)
                .filter(job => rangesCollide(job, leave, true));

            if (otherParentJobs.length === 0) {
                return { [PdfService.ALL_FIELDS_MAP.otherParentAttestations.works.no]: true };
            }

            const prevDays = otherParentJobs
                .flatMap(job => job.leaves)
                .flatMap(jobLeave => jobLeave.daysTaken)
                .filter(date => date.startsWith(currentYear))
                .length;

            return {
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.works.yes]: true,
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.works.shiftNo]: true,
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.tookLeave.yes]: prevDays > 0,
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.tookLeave.no]: prevDays === 0,
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.tookLeave.kidTo8Or14Check]: prevDays > 0,
                [PdfService.ALL_FIELDS_MAP.otherParentAttestations.tookLeave.kidTo8Or14Days]: prevDays ? `${prevDays}` : ''
            };
        }
    };

    private readonly font: Buffer;

    private readonly template: Buffer;

    constructor(
        @Inject(DrizzleAsyncProvider)
        private readonly db: DrizzleDb
    ) {
        this.template = readFileSync(
            resolve('src/assets', `Z-15A.${PdfService.CURRENT_VERSION}.pdf`)
        );
        this.font = readFileSync(
            resolve('src/assets', 'NotoSans-VariableFont_wdth,wght.ttf')
        );
    }

    async generatePdf(leaveId: number, user: string) {
        const [[leave, jobs], doc] = await Promise.all([
            this.getLeaveAndJobs(leaveId, user),
            PDFDocument.load(this.template)
        ]);

        doc.registerFontkit(fontkit);
        const font = await doc.embedFont(this.font);

        const form = doc.getForm();

        for (const dynamicFieldsConfig of Object.values(PdfService.FIELDS)) {
            const config = dynamicFieldsConfig(leave, jobs);

            for (const fieldName in config) {
                if (Object.hasOwn(config, fieldName)) {
                    this.fillField(form, fieldName, config[fieldName]);
                }
            }
        }

        form.updateFieldAppearances(font);

        form.flatten();

        while (doc.getPageCount() > PdfService.KEEP_MAX_PAGES) {
            doc.removePage(PdfService.KEEP_MAX_PAGES);
        }

        return await doc.save();
    }

    private fillField(form: PDFForm, fieldName: string, value: string | boolean) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (typeof value) {
            case 'boolean': {
                const field = form.getCheckBox(fieldName);
                if (value) {
                    field.check();
                } else {
                    field.uncheck();
                }
                break;
            }
            case 'string': {
                const field = form.getTextField(fieldName);
                field.setText(value);
                break;
            }
            default:
                break;
        }
    }

    private async getLeaveAndJobs(leaveId: number, userId: string) {
        const [leave, jobs] = await Promise.all([
            this.db.query.leaves.findFirst({
                where: eq(leaves.id, leaveId),
                with: {
                    kid: {
                        with: {
                            father: true,
                            mother: true
                        }
                    },
                    job: { with: { caretaker: true } }
                }
            }),
            this.db.query.jobs.findMany({ with: { leaves: true } })
        ]);

        if (leave?.userId !== userId) {
            throw new BadRequestException('Leave with given id not found');
        }

        return [leave, jobs] as const;
    }

    private static datesToRanges([firstDate, ...dates]: PlainDate[]) {
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
}

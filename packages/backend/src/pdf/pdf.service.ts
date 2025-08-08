import { resolve } from 'node:path';

import fontkit from '@pdf-lib/fontkit';
import { eq } from 'drizzle-orm';
import type { PDFForm } from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';

import { BaseRepo } from '../database/repo';
import { leaves } from '../database/schemas/index';
import { AppError, ErrorType } from '../errors/index';

import { AssetsCache } from './assets-cache';
import { Z15A_FIELD_RESOLVERS } from './fieldsResolvers';


// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type LeaveWithData = NonNullable<Awaited<ReturnType<PdfService['getLeaveAndJobs']>>>['leave'];
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type Job = NonNullable<Awaited<ReturnType<PdfService['getLeaveAndJobs']>>>['jobs'][number];

export class PdfService extends BaseRepo {
    private static readonly CURRENT_VERSION = '20250707';

    private static readonly KEEP_MAX_PAGES = 5;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static readonly CACHE = new AssetsCache({
        font: { path: resolve('src/assets', 'NotoSans-VariableFont_wdth,wght.ttf') },
        template: { path: resolve('src/assets', `Z-15A.${PdfService.CURRENT_VERSION}.pdf`) }
    });

    private async getTemplateDocument() {
        return await PDFDocument.load(await PdfService.CACHE.get('template'));
    }

    private async getTemplateDocumentWithFont() {
        const [doc, fontBuffer] = await Promise.all([
            this.getTemplateDocument(),
            PdfService.CACHE.get('font')
        ]);
        doc.registerFontkit(fontkit);
        const font = await doc.embedFont(fontBuffer);
        return { doc, font };
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    async generatePdf(leaveId: number, user: string, title?: string) {
        const [{ leave, jobs }, { doc, font }] = await Promise.all([
            this.getLeaveAndJobs(leaveId, user),
            this.getTemplateDocumentWithFont()
        ]);

        const form = doc.getForm();

        for (const dynamicFieldsConfig of Object.values(Z15A_FIELD_RESOLVERS)) {
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

        if (title) {
            doc.setTitle(title, { showInWindowTitleBar: true });
        }

        return Buffer.from(await doc.save());
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    async getEmailReceiverForLeave(leaveId: number) {
        const leave = await this.db.query.leaves.findFirst({
            where: eq(leaves.id, leaveId),
            with: { job: { with: { caretaker: true } } }
        });
        return leave?.job.caretaker.email;
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
            throw new AppError(ErrorType.UNAUTHORIZED, 'Leave with given id not found');
        }

        return { leave, jobs };
    }
}

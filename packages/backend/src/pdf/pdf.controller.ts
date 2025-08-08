import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { AppError, ErrorType } from '../errors/index';

import { MailerService } from './mailer.service';
import { PdfService } from './pdf.service';


export const pdfController: FastifyPluginCallback = (instance, options, done) => {
    const pdfService = new PdfService();
    const mailerService = new MailerService();

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/:id',
        {
            preHandler(request, reply, preHandlerDone) {
                reply.header('cache-control', 'no-cache, no-store, must-revalidate');
                reply.header('pragma', 'no-cache');
                reply.header('expires', '0');
                preHandlerDone();
            },
            schema: {
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) }),
                querystring: z.object({ title: z.string().optional() })
            }
        },
        async (request, reply) => {
            const pdf = await pdfService.generatePdf(request.params.id, request.user.username, request.query.title);
            reply.header('content-type', 'application/pdf');
            reply.send(pdf);
            await reply;
        }
    );

    f.get(
        '/:id/mail',
        {
            preHandler(request, reply, preHandlerDone) {
                reply.header('cache-control', 'no-cache, no-store, must-revalidate');
                reply.header('pragma', 'no-cache');
                reply.header('expires', '0');
                preHandlerDone();
            },
            schema: {
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) }),
                querystring: z.object({ title: z.string().optional() })
            }
        },
        async request => {
            const email = await pdfService.getEmailReceiverForLeave(request.params.id);

            if (!email) {
                throw new AppError(ErrorType.BAD_REQUEST, 'no email found');
            }

            const { title } = request.query;
            const pdf = await pdfService.generatePdf(request.params.id, request.user.username, title);

            const emailResult = await mailerService.sendMail({
                to: email,
                subject: title ?? 'Formularz Z-15A',
                text: 'Formularz w załączniku. Zdrówka dla dziecka :)',
                attachments: [
                    {
                        filename: title ? `${title}.pdf` : 'Formularz Z-15A.pdf',
                        content: pdf,
                        contentType: 'application/pdf'
                    }
                ]
            });

            // eslint-disable-next-line security-node/detect-crlf
            console.log(emailResult);

            return { status: 'ok', emailResult };
        }
    );

    done();
};

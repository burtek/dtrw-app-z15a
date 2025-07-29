/* eslint n/no-extraneous-import: ['error', { allowModules: ['express'] }] */
import { Controller, Param, Get, ParseIntPipe, Query, Res, BadRequestException, Header } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Response as AppResponse } from 'express';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(
        private readonly pdfService: PdfService,
        private readonly mailerService: MailerService
    ) {
    }

    @Get(':id')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
    @Header('Pragma', 'no-cache')
    @Header('Expires', '0')
    async generate(
        @Param('id', ParseIntPipe) id: number,
        @Query('title') title: string | undefined,
        @AuthUser() user: AutheliaAuthInfo,
        @Res() response: AppResponse
    ) {
        const pdf = await this.pdfService.generatePdf(id, user.username, title);
        response.setHeader('Content-Type', 'application/pdf');
        response.end(pdf);
    }

    @Get(':id/mail')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
    @Header('Pragma', 'no-cache')
    @Header('Expires', '0')
    async sendMail(
        @Param('id', ParseIntPipe) id: number,
        @Query('title') title: string | undefined,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        const email = await this.pdfService.getEmailReceiverForLeave(id);

        if (!email) {
            throw new BadRequestException(
                { ok: false },
                'no email found'
            );
        }

        const pdf = await this.pdfService.generatePdf(id, user.username, title);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const emailResult: {
            accpted: string[];
            rejected: string[];
            response: string;
            messageId: string;
        } = await this.mailerService.sendMail({
            to: email,
            subject: title ?? 'Formularz Z-15A',
            text: 'Formularz w załączniku. Zdrówka dla dziecka :)',
            attachments: [
                {
                    filename: title ? (title.endsWith('.pdf') ? title : `${title}.pdf`) : 'Formularz Z-15A.pdf',
                    content: pdf,
                    contentType: 'application/pdf'
                }
            ]
        });

        // eslint-disable-next-line security-node/detect-crlf
        console.log(emailResult);

        return { status: 'ok', emailResult };
    }
}

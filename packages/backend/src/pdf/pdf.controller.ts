/* eslint-disable n/no-extraneous-import */
import { Controller, Param, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {
    }

    @Get(':id')
    async modify(@Param('id') id: string, @Res() res: Response) {
        const data = await this.pdfService.generatePdf(parseInt(id, 10));

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="file.pdf"'
        });
        res.send(data);
    }
}

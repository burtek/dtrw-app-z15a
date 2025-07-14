import { Controller, Param, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {
    }

    @Get(':id')
    async modify(@Param('id') id: string, @Res() response: Response) {
        try {
            const data = await this.pdfService.generatePdf(parseInt(id, 10));

            response.set({ 'Content-Type': 'application/pdf' });
            response.send(data);
        } catch (error) {
            response.status(500);
            console.error(error);
        }
    }
}

import { Controller, Param, Get } from '@nestjs/common';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {
    }

    @Get(':id')
    modify(@Param('id') id: string) {
        return this.pdfService.generatePdf(parseInt(id, 10));
    }
}

import { Controller, Param, Get, Header, ParseIntPipe } from '@nestjs/common';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {
    }

    @Get(':id')
    @Header('Content-Type', 'application/pdf')
    generate(
        @Param('id', ParseIntPipe) id: number,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return this.pdfService.generatePdf(id, user.username);
    }
}

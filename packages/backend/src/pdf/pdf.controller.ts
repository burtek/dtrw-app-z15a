import { Controller, Param, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { PdfService } from './pdf.service';


@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {
    }

    @Get(':id')
    // @UseInterceptors(PdfInterceptor)
    async generate(
        @Param('id', ParseIntPipe) id: number,
        @Query('title') title: string | undefined,
        @AuthUser() user: AutheliaAuthInfo,
        @Res() response: Response
    ) {
        const pdf = await this.pdfService.generatePdf(id, user.username, title);
        response.setHeader('Content-Type', 'application/pdf');
        response.end(pdf);
    }
}

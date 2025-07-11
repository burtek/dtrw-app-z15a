import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';


@Module({
    imports: [DrizzleModule],
    controllers: [PdfController],
    providers: [PdfService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PdfModule {
}

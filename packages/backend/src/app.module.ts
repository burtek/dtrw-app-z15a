import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaretakersModule } from './caretakers/caretakers.module';
import { validate } from './env.validation';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { KidsModule } from './kids/kids.module';
import { LeavesModule } from './leaves/leaves.module';
import { PdfModule } from './pdf/pdf.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate
        }),
        HealthModule,
        JobsModule,
        KidsModule,
        LeavesModule,
        CaretakersModule,
        PdfModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {
}

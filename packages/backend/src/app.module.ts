import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { Z15aGuard } from './auth/z15a.guard';
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
    providers: [
        {
            provide: APP_GUARD,
            useClass: Z15aGuard
        }
    ]

})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {
}

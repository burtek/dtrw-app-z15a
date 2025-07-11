import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';


@Module({
    imports: [DrizzleModule],
    controllers: [HealthController],
    providers: [HealthService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HealthModule {
}

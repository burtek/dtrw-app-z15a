import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';


@Module({
    imports: [DrizzleModule],
    controllers: [JobsController],
    providers: [JobsService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class JobsModule {
}

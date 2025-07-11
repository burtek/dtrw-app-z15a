import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';


@Module({
    imports: [DrizzleModule],
    controllers: [LeavesController],
    providers: [LeavesService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LeavesModule {
}

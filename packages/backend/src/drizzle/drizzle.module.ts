import { Module } from '@nestjs/common';

import { DrizzleService } from './drizzle.service';


@Module({
    providers: [DrizzleService],
    exports: [DrizzleService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DrizzleModule {
}

import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { KidsController } from './kids.controller';
import { KidsService } from './kids.service';


@Module({
    imports: [DrizzleModule],
    controllers: [KidsController],
    providers: [KidsService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class KidsModule {
}

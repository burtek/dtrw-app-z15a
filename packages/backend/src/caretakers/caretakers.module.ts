import { Module } from '@nestjs/common';

import { DrizzleModule } from '../drizzle/drizzle.module';

import { CaretakersController } from './caretakers.controller';
import { CaretakersService } from './caretakers.service';


@Module({
    imports: [DrizzleModule],
    controllers: [CaretakersController],
    providers: [CaretakersService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CaretakersModule {
}

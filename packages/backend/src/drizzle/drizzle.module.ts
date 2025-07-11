import { Module } from '@nestjs/common';

import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';


@Module({
    providers: [...drizzleProvider],
    exports: [DrizzleAsyncProvider]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DrizzleModule {
}

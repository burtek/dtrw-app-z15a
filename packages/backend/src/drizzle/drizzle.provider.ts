import type { Provider } from '@nestjs/common';

import { DrizzleService } from './drizzle.service';


export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
    {
        provide: DrizzleAsyncProvider,
        useClass: DrizzleService
    }
] satisfies [Provider] | Provider[];

export type DrizzleDb = ReturnType<DrizzleService['getDb']>;

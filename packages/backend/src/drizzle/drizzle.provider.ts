/* eslint-disable @typescript-eslint/naming-convention */
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from '../database/schemas';


export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

let database: Database.Database | undefined;

export const drizzleProvider = [
    {
        provide: DrizzleAsyncProvider,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            if (!database) {
                const path = configService.get<string>('DB_FILE_NAME', '');
                database = new Database(path);
            }
            return drizzle(database, { schema });
        }
    }
] satisfies [Provider] | Provider[];

export type DrizzleDb = ReturnType<typeof drizzleProvider[0]['useFactory']>;

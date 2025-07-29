/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import * as schema from '../database/schemas';


const makeDb = (database: Database.Database) => drizzle(database, { schema });

@Injectable()
export class DrizzleService implements OnModuleDestroy {
    private readonly database: Database.Database;
    private readonly drizzleDb: ReturnType<typeof makeDb>;

    constructor(configService: ConfigService) {
        const path = configService.getOrThrow<string>('DB_FILE_NAME');
        this.database = new Database(path);
        this.drizzleDb = makeDb(this.database);
        console.log('Database open, migrating...');
        migrate(this.drizzleDb, { migrationsFolder: configService.getOrThrow<string>('DB_MIGRATIONS_FOLDER') });
        console.log('Database migrated');
    }

    get db() {
        return this.drizzleDb;
    }

    getStatus() {
        return this.database.open;
    }

    onModuleDestroy() {
        this.database.close();
        console.log('Database closed');
    }
}

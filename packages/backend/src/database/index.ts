/* eslint-disable import-x/no-named-as-default */
import { createRequire } from 'node:module';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { env } from '../config';

import * as schema from './schemas';


const makeDb = (database: Database.Database) => drizzle(database, { schema });
export type DB = ReturnType<typeof makeDb>;

let dbInstance: Database.Database | null = null;
let drizzleDb: DB | null = null;

export function getDb(): DB {
    const options: Database.Options = { readonly: false };
    if (env.USE_BS3_BIN) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        options.nativeBinding = createRequire(import.meta.url)('../assets/better_sqlite3.node24-alpine.node');
    }
    dbInstance ??= new Database(env.DB_FILE_NAME, options);
    drizzleDb ??= makeDb(dbInstance);

    return drizzleDb;
}

export function runMigrations() {
    const db = getDb();

    console.log('Database open, migrating...');
    migrate(db, { migrationsFolder: env.DB_MIGRATIONS_FOLDER });
    console.log('Database migrated');
}

export function closeDb() {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}

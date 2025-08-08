import { createApp } from './app';
import { env } from './config';
import { runMigrations } from './database/index';


const { app, shutdown } = createApp({ logger: true });

runMigrations();

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

await app.listen({
    port: env.PORT,
    host: '0.0.0.0'
});

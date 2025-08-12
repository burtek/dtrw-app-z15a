import { createApp } from './app';
import { env } from './config';
import { runMigrations } from './database/index';


const { app, shutdown } = createApp();

runMigrations(app.log);

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
// eslint-disable-next-line promise/prefer-await-to-callbacks
}).catch((error: unknown) => {
    app.log.error(error);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
});

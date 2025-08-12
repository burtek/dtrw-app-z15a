import type { FastifyServerOptions } from 'fastify';
import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { caretakersController } from './caretakers/caretakers.controller';
import { env } from './config';
import { getDb } from './database/index';
import { decorateRequestUser } from './decorators/auth.decorator';
import { decorateErrorHandler } from './decorators/error.decorator';
import { healthController } from './health/health.controller';
import { jobsController } from './jobs/jobs.controller';
import { kidsController } from './kids/kids.controller';
import { leavesController } from './leaves/leaves.controller';
import { pdfController } from './pdf/pdf.controller';


const loggerConfig: FastifyServerOptions['logger'] = {
    test: false,
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    },
    production: env.LOGS_FILE
        ? { file: env.LOGS_FILE.replace('{{date}}', new Date().toISOString().substring(0, 19)) }
        : true
}[env.NODE_ENV];

export function createApp(opts: FastifyServerOptions = {}) {
    opts.logger ??= loggerConfig;
    const app = fastify(opts);

    decorateErrorHandler(app);

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(healthController, { prefix: '/health' });

    decorateRequestUser(app);

    app.register(kidsController, { prefix: '/kids' });
    app.register(leavesController, { prefix: '/leaves' });
    app.register(pdfController, { prefix: '/pdf' });
    app.register(jobsController, { prefix: '/jobs' });
    app.register(caretakersController, { prefix: '/caretakers' });

    app.addHook('onClose', instance => {
        instance.log.info('Closing database...');
        getDb(instance.log).$client.close();
        instance.log.info('Database closed');
    });

    return {
        app,
        async shutdown(signal: string) {
            app.log.info(`Received ${signal}, shutting down gracefully...`);
            try {
                await app.close();
                app.log.info('Fastify closed. Bye!');
                // eslint-disable-next-line n/no-process-exit
                process.exit(0);
            } catch (err) {
                app.log.error(err, 'Error during shutdown');
                throw err;
            }
        }
    };
}

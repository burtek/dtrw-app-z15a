import type { FastifyServerOptions } from 'fastify';
import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { caretakersController } from './caretakers/caretakers.controller';
import { getDb } from './database/index';
import { decorateRequestUser } from './decorators/auth.decorator';
import { decorateErrorHandler } from './decorators/error.decorator';
import { healthController } from './health/health.controller';
import { jobsController } from './jobs/jobs.controller';
import { kidsController } from './kids/kids.controller';
import { leavesController } from './leaves/leaves.controller';
import { pdfController } from './pdf/pdf.controller';


export function createApp(opts: FastifyServerOptions = {}) {
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

    app.addHook('onClose', () => {
        console.log('Closing database...');
        getDb().$client.close();
        console.log('Database closed');
    });

    return {
        app,
        async shutdown(signal: string) {
            console.log(`Received ${signal}, shutting down gracefully...`);
            try {
                await app.close();
                console.log('Fastify closed. Bye!');
                // eslint-disable-next-line n/no-process-exit
                process.exit(0);
            } catch (err) {
                console.error('Error during shutdown', err);
                throw err;
            }
        }
    };
}

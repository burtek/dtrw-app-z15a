import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { JobSchema } from './job.schema';
import { JobsService } from './jobs.service';


export const jobsController: FastifyPluginCallback = (instance, options, done) => {
    const jobsService = new JobsService();

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async request => await jobsService.findAll(request.user.username)
    );

    f.post(
        '/',
        { schema: { body: JobSchema } },
        async request => await jobsService.create(request.body, request.user.username)
    );

    f.post(
        '/:id',
        {
            schema: {
                body: JobSchema,
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) })
            }
        },
        async request => await jobsService.update(request.params.id, request.body, request.user.username)
    );

    done();
};

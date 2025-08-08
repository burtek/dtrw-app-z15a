import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { KidSchema } from './kid.schema';
import { KidsService } from './kids.service';


export const kidsController: FastifyPluginCallback = (instance, options, done) => {
    const kidsService = new KidsService();

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async request => await kidsService.findAll(request.user.username)
    );

    f.post(
        '/',
        { schema: { body: KidSchema } },
        async request => await kidsService.create(request.body, request.user.username)
    );

    f.post(
        '/:id',
        {
            schema: {
                body: KidSchema,
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) })
            }
        },
        async request => await kidsService.update(request.params.id, request.body, request.user.username)
    );

    done();
};

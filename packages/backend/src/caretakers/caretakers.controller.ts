import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { CaretakerSchema } from './caretaker.schema';
import { CaretakersService } from './caretakers.service';


export const caretakersController: FastifyPluginCallback = (instance, options, done) => {
    const kidsService = new CaretakersService(instance);

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async request => await kidsService.findAll(request.user.username)
    );

    f.post(
        '/',
        { schema: { body: CaretakerSchema } },
        async request => await kidsService.create(request.body, request.user.username)
    );

    f.post(
        '/:id',
        {
            schema: {
                body: CaretakerSchema,
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) })
            }
        },
        async request => await kidsService.update(request.params.id, request.body, request.user.username)
    );

    done();
};

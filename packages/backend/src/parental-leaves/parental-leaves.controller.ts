import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { ParentalLeaveSchema } from './parental-leave.schema';
import { ParentalLeavesService } from './parental-leaves.service';


export const parentalLeavesController: FastifyPluginCallback = (instance, options, done) => {
    const parentalLeavesService = new ParentalLeavesService(instance);

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async request => await parentalLeavesService.findAll(request.user.username)
    );

    f.post(
        '/',
        { schema: { body: ParentalLeaveSchema } },
        async request => await parentalLeavesService.create(request.body, request.user.username)
    );

    f.post(
        '/:id',
        {
            schema: {
                body: ParentalLeaveSchema,
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) })
            }
        },
        async request => await parentalLeavesService.update(request.params.id, request.body, request.user.username)
    );

    done();
};

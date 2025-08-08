import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { LeaveSchema } from './leave.schema';
import { LeavesService } from './leaves.service';


export const leavesController: FastifyPluginCallback = (instance, options, done) => {
    const leavesService = new LeavesService();

    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async request => await leavesService.findAll(request.user.username)
    );

    f.post(
        '/',
        { schema: { body: LeaveSchema } },
        async request => await leavesService.create(request.body, request.user.username)
    );

    f.post(
        '/:id',
        {
            schema: {
                body: LeaveSchema,
                params: z.object({ id: z.coerce.number().positive().refine(val => Number.isInteger(val)) })
            }
        },
        async request => await leavesService.update(request.params.id, request.body, request.user.username)
    );

    done();
};

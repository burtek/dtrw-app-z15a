/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fastify } from 'fastify';

import packageJson from '../../package.json';
import { getDb } from '../database';

import { healthController } from './health.controller';


vitest.mock(import('../database'), () => ({ getDb: vitest.fn() }));

describe('HealthController', () => {
    const app = fastify();
    app.register(healthController, { prefix: '/health' });

    afterAll(async () => {
        await app.close();
    });

    it.each([
        {
            dbStatus: true,
            expected: {
                status: 'ok',
                errors: []
            }
        },
        {
            dbStatus: false,
            expected: {
                status: 'nieok',
                errors: ['Database closed']
            }
        }
    ])('should return correct data', async ({ dbStatus, expected }) => {
        // @ts-expect-error - minimal mocking
        vitest.mocked(getDb).mockReturnValue({ $client: { open: dbStatus } });

        const response = await app.inject({
            method: 'GET',
            url: '/health'
        });

        expect(response.json()).toStrictEqual({
            ...expected,
            timestamp: expect.stringMatching(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/),
            uptime: expect.any(Number),
            commit: 'dev',
            version: packageJson.version,
            nodeVersion: expect.any(String),
            memoryUsage: expect.anything(),
            cpuUsage: expect.anything(),
            platform: expect.any(String),
            arch: expect.any(String),
            freeMemory: expect.any(Number)
        });
    });
});

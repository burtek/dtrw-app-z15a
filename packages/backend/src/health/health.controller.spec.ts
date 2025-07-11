/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { readFileSync } from 'node:fs';

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';


describe('HealthController', () => {
    let healthController: HealthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [HealthService]
        }).compile();

        healthController = app.get<HealthController>(HealthController);
    });

    describe('root', () => {
        it('should return valid data', () => {
            expect(healthController.getHealth()).toStrictEqual({
                status: 'ok',
                timestamp: expect.stringMatching(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/),
                uptime: expect.any(Number),
                commit: 'dev',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                version: JSON.parse(readFileSync('../../package.json', 'utf-8')).version,
                nodeVersion: expect.any(String),
                memoryUsage: expect.anything(),
                cpuUsage: expect.anything(),
                platform: expect.any(String),
                arch: expect.any(String),
                freeMemory: expect.any(Number)
            });
        });
    });
});

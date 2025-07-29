import { Controller, Get } from '@nestjs/common';

import { DrizzleService } from '../drizzle/drizzle.service';

import { HealthService } from './health.service';


// in future replace with https://docs.nestjs.com/recipes/terminus

@Controller('health')
export class HealthController {
    constructor(
        private readonly healthService: HealthService,
        private readonly databaseService: DrizzleService
    ) {
    }

    @Get()
    getHealth() {
        return {
            status: this.databaseService.getStatus() ? 'ok' : 'nieok',
            errors: [this.databaseService.getStatus() ? null : 'Database closed'].filter(x => x !== null),
            timestamp: new Date().toISOString(),
            uptime: process.uptime(), // seconds
            commit: process.env.COMMIT_SHA ?? 'dev',
            version: this.healthService.getVersion(),
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            platform: process.platform,
            arch: process.arch,
            freeMemory: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed
        };
    }
}

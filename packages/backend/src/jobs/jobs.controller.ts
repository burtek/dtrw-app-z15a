import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { JobDto } from './job.dto';
import { JobsService } from './jobs.service';


@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {
    }

    @Post()
    async create(
        @Body() job: JobDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.jobsService.create(job, user.username);
    }

    @Get()
    async findAll(@AuthUser() user: AutheliaAuthInfo) {
        return await this.jobsService.findAll(user.username);
    }

    @Post(':id')
    async modify(
        @Param('id', ParseIntPipe) id: number,
        @Body() job: JobDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.jobsService.update(id, job, user.username);
    }
}

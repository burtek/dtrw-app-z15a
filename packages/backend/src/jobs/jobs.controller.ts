import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { JobDto } from './job.dto';
import { JobsService } from './jobs.service';


@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {
    }

    @Post()
    create(@Body() job: JobDto) {
        return this.jobsService.create(job);
    }

    @Get()
    findAll() {
        return this.jobsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.findOne(id);
    }

    @Post(':id')
    modify(@Param('id', ParseIntPipe) id: number, @Body() job: JobDto) {
        return this.jobsService.update(id, job);
    }
}

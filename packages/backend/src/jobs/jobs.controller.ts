import { Controller, Get, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { JobDto } from './job.dto';
import { JobsService } from './jobs.service';


@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {
    }

    @Post()
    async create(@Body() job: JobDto, @Res() response: Response) {
        try {
            response.send(await this.jobsService.create(job));
        } catch (error) {
            if (error instanceof Error) {
                response.status(400);
                response.send({ message: [error.message] });
            } else {
                response.status(500);
                console.error(error);
            }
        }
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
    async modify(@Param('id', ParseIntPipe) id: number, @Body() job: JobDto, @Res() response: Response) {
        try {
            response.send(await this.jobsService.update(id, job));
        } catch (error) {
            if (error instanceof Error) {
                response.status(400);
                response.send({ message: [error.message] });
            } else {
                response.status(500);
                console.error(error);
            }
        }
    }
}

import { Controller, Get, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { LeaveDto } from './leave.dto';
import { LeavesService } from './leaves.service';


@Controller('leaves')
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) {
    }

    @Post()
    async create(@Body() leave: LeaveDto, @Res() response: Response) {
        try {
            response.send(await this.leavesService.create(leave));
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
        return this.leavesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.leavesService.findOne(id);
    }

    @Post(':id')
    async modify(@Param('id', ParseIntPipe) id: number, @Body() leave: LeaveDto, @Res() response: Response) {
        try {
            response.send(await this.leavesService.update(id, leave));
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

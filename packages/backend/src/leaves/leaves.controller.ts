import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { LeaveDto } from './leave.dto';
import { LeavesService } from './leaves.service';


@Controller('leaves')
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) {
    }

    @Post()
    create(@Body() leave: LeaveDto) {
        return this.leavesService.create(leave);
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
    modify(@Param('id', ParseIntPipe) id: number, @Body() leave: LeaveDto) {
        return this.leavesService.update(id, leave);
    }
}

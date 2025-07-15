import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { LeaveDto } from './leave.dto';
import { LeavesService } from './leaves.service';


@Controller('leaves')
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) {
    }

    @Post()
    async create(
        @Body() leave: LeaveDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.leavesService.create(leave, user.username);
    }

    @Get()
    findAll(@AuthUser() user: AutheliaAuthInfo) {
        return this.leavesService.findAll(user.username);
    }

    @Post(':id')
    async modify(
        @Param('id', ParseIntPipe) id: number,
        @Body() leave: LeaveDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.leavesService.update(id, leave, user.username);
    }
}

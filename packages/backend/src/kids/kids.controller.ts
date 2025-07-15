import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { KidDto } from './kid.dto';
import { KidsService } from './kids.service';


@Controller('kids')
export class KidsController {
    constructor(private readonly kidsService: KidsService) {
    }

    @Post()
    async create(
        @Body() kid: KidDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.kidsService.create(kid, user.username);
    }

    @Get()
    async findAll(@AuthUser() user: AutheliaAuthInfo) {
        return await this.kidsService.findAll(user.username);
    }

    @Post(':id')
    async modify(
        @Param('id', ParseIntPipe) id: number,
        @Body() kid: KidDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.kidsService.update(id, kid, user.username);
    }
}

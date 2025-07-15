import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { AutheliaAuthInfo, AuthUser } from '../auth/auth-user.decorator';

import { CaretakerDto } from './caretaker.dto';
import { CaretakersService } from './caretakers.service';


@Controller('caretakers')
export class CaretakersController {
    constructor(private readonly caretakersService: CaretakersService) {
    }

    @Post()
    async create(
        @Body() caretaker: CaretakerDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.caretakersService.create(caretaker, user.username);
    }

    @Get()
    async findAll(@AuthUser() user: AutheliaAuthInfo) {
        return await this.caretakersService.findAll(user.username);
    }

    @Post(':id')
    async modify(
        @Param('id', ParseIntPipe) id: number,
        @Body() caretaker: CaretakerDto,
        @AuthUser() user: AutheliaAuthInfo
    ) {
        return await this.caretakersService.update(id, caretaker, user.username);
    }
}

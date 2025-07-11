import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { KidDto } from './kid.dto';
import { KidsService } from './kids.service';


@Controller('kids')
export class KidsController {
    constructor(private readonly kidsService: KidsService) {
    }

    @Post()
    create(@Body() kid: KidDto) {
        return this.kidsService.create(kid);
    }

    @Get()
    findAll() {
        return this.kidsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.kidsService.findOne(id);
    }

    @Post(':id')
    modify(@Param('id', ParseIntPipe) id: number, @Body() kid: KidDto) {
        return this.kidsService.update(id, kid);
    }
}

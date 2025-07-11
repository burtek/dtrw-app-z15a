import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { CaretakerDto } from './caretaker.dto';
import { CaretakersService } from './caretakers.service';


@Controller('caretakers')
export class CaretakersController {
    constructor(private readonly caretakersService: CaretakersService) {
    }

    @Post()
    create(@Body() caretaker: CaretakerDto) {
        return this.caretakersService.create(caretaker);
    }

    @Get()
    findAll() {
        return this.caretakersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.caretakersService.findOne(id);
    }

    @Post(':id')
    modify(@Param('id', ParseIntPipe) id: number, @Body() caretaker: CaretakerDto) {
        return this.caretakersService.update(id, caretaker);
    }
}

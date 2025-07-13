import { Controller, Get, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { CaretakerDto } from './caretaker.dto';
import { CaretakersService } from './caretakers.service';


@Controller('caretakers')
export class CaretakersController {
    constructor(private readonly caretakersService: CaretakersService) {
    }

    @Post()
    async create(@Body() caretaker: CaretakerDto, @Res() response: Response) {
        try {
            response.send(await this.caretakersService.create(caretaker));
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
        return this.caretakersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.caretakersService.findOne(id);
    }

    @Post(':id')
    async modify(@Param('id', ParseIntPipe) id: number, @Body() caretaker: CaretakerDto, @Res() response: Response) {
        try {
            response.send(await this.caretakersService.update(id, caretaker));
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

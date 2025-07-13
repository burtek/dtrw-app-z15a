import { Controller, Get, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';

import { KidDto } from './kid.dto';
import { KidsService } from './kids.service';


@Controller('kids')
export class KidsController {
    constructor(private readonly kidsService: KidsService) {
    }

    @Post()
    async create(@Body() kid: KidDto, @Res() response: Response) {
        try {
            response.send(await this.kidsService.create(kid));
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
        return this.kidsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.kidsService.findOne(id);
    }

    @Post(':id')
    async modify(@Param('id', ParseIntPipe) id: number, @Body() kid: KidDto, @Res() response: Response) {
        try {
            response.send(await this.kidsService.update(id, kid));
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

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() body: any) { return this.clientsService.create(body); }

  @Get()
  findAll() { return this.clientsService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.clientsService.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.clientsService.update(id, body); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.clientsService.remove(id); }
}
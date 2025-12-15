import { Controller, Get, Param, Put, Body, Post } from '@nestjs/common';
import { GymsService } from './gyms.service';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Post()
  create(@Body() body: any) {
    return this.gymsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.gymsService.update(id, body);
  }
}

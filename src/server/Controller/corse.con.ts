import { Controller, Get, Param } from '@nestjs/common';
import { CoursesServices } from '../Services/corse.srv';

@Controller('api/course')
export class CorseControll {
  constructor(private corseServices: CoursesServices) {}
  @Get()
  public async getAll() {
    return await this.corseServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.corseServices.findOne(id);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { InstructorCoursesServices } from '../Services/inco.srv';

@Controller('api/inco')
export class IncoControll {
  constructor(private incoServices: InstructorCoursesServices) {}
  @Get()
  public async getAll() {
    return await this.incoServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.incoServices.findOne(id);
  }
}

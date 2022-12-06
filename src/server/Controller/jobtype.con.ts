import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobTypeService } from '../Services/jobtype.srv';

@Controller('api/jobtype')
export class JobTypeController {
  constructor(private jobTypeService: JobTypeService) {}

  @Get()
  public async getAll() {
    return await this.jobTypeService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.jobTypeService.findOne(id);
  }

  @Post()
  public async create(@Body() fields: any) {
    return this.jobTypeService.create(fields);
  }

  @Put()
  public async update(@Param('id') id: string, @Body() fields: any) {
    return this.jobTypeService.update(id, fields);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.jobTypeService.delete(id);
  }
}

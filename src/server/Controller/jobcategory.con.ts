import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobCategoryService } from '../Services/jobcategory.srv';

@Controller('api/jobcategory')
export class JobCategoryController {
  constructor(private jobCategoryService: JobCategoryService) {}

  @Get()
  public async getAll() {
    return await this.jobCategoryService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.jobCategoryService.findOne(id);
  }

  @Post()
  public async create(@Body() fields: any) {
    return this.jobCategoryService.create(fields);
  }

  @Put()
  public async update(@Param('id') id: string, @Body() fields: any) {
    return this.jobCategoryService.update(id, fields);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.jobCategoryService.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { JobPost } from '../../entities/JobPost';
import { Client } from '../../entities/Client';
import { JobPostService } from '../Services/jobpost.srv';

@Controller('api/jobpost')
export class JobPostController {
  constructor(private jobPostService: JobPostService) {}

  @Get()
  public async getAll() {
    return await this.jobPostService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.jobPostService.findOne(id);
  }

  @Post()
  public async create(@Body() fields: any) {
    return this.jobPostService.create(fields);
  }

  @Put()
  public async update(@Param('id') id: string, @Body() fields: any) {
    return this.jobPostService.update(id, fields);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.jobPostService.delete(id);
  }
}

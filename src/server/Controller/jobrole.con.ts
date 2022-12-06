import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobRoleService } from '../Services/jobrole.srv';

@Controller('api/jobrole')
export class JobRoleController {
  constructor(private jobRoleService: JobRoleService) {}

  @Get()
  public async getAll() {
    return await this.jobRoleService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.jobRoleService.findOne(id);
  }

  @Post()
  public async create(@Body() fields: any) {
    return this.jobRoleService.create(fields);
  }

  @Put()
  public async update(@Param('id') id: string, @Body() fields: any) {
    return this.jobRoleService.update(id, fields);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.jobRoleService.delete(id);
  }
}

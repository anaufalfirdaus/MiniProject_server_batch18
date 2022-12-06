import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClientService } from '../Services/client.srv';

@Controller('api/client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  public async getAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.clientService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'clitLogo' }]))
  public async create(@UploadedFiles() file: any, @Body() fields: any) {
    return this.clientService.create(file, fields);
  }

  @Put()
  public async update(@Param('id') id: string, @Body() fields: any) {
    return this.clientService.update(id, fields);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.clientService.delete(id);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { CoreServices } from '../Services/core.srv';

@Controller('api/coursereview')
export class CoreControll {
  constructor(private coreServices: CoreServices) {}
  @Get()
  public async getAll() {
    return await this.coreServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.coreServices.findOne(id);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { CosmServices } from '../Services/cosm.srv';

@Controller('api/cosm')
export class CosmControll {
  constructor(private cosmServices: CosmServices) {}
  @Get()
  public async getAll() {
    return await this.cosmServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.cosmServices.findOne(id);
  }
}

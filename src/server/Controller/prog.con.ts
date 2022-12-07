import { Controller, Get, Param } from '@nestjs/common';
import { ProgramEntitiesServices } from '../Services/prog.srv';

@Controller('api/programentity')
export class ProgControll {
  constructor(private progServices: ProgramEntitiesServices) {}
  @Get()
  public async getAll() {
    return await this.progServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.progServices.findOne(id);
  }
}

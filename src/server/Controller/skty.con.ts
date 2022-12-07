import { Controller, Get, Param } from '@nestjs/common';
import { SkillTypeServices } from '../Services/skty.srv';

@Controller('api/skilltype')
export class SktyControll {
  constructor(private sktyServices: SkillTypeServices) {}
  @Get()
  public async getAll() {
    return await this.sktyServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string) {
    return await this.sktyServices.findOne(id);
  }
}

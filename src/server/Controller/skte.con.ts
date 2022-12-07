import { Controller, Get, Param } from '@nestjs/common';
import { SkillTemplateServices } from '../Services/skte.srv';

@Controller('api/skilltemplate')
export class SkteControll {
  constructor(private skteServices: SkillTemplateServices) {}
  @Get()
  public async getAll() {
    return await this.skteServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.skteServices.findOne(id);
  }
}

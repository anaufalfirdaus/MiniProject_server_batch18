import { Controller, Get, Param } from '@nestjs/common';
import { ContentsServices } from '../Services/cont.srv';

@Controller('api/content')
export class ContControll {
  constructor(private contServices: ContentsServices) {}
  @Get()
  public async getAll() {
    return await this.contServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.contServices.findOne(id);
  }
}

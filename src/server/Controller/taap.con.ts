import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { TaapService } from '../Services/taap.srv';

@Controller()
export class TaapController {
  constructor(private taapService: TaapService) {}

  @Get('/taap')
  async GetAll() {
    return this.taapService.findAll();
  }

  @Get('/taap/user')
  async GetAllUser() {
    return this.taapService.getAllUser();
  }

  @Get('taap/:id')
  public async GetOne(@Param('id') id: number) {
    return this.taapService.findOne(id);
  }

  @Post('/taap')
  async Create(@Body() fields: any) {
    const taapIntro = fields.taapIntro;
    const taapScoring = fields.taapScoring;
    const taapModifiedDate = fields.taapModifiedDate;
    const taapStatus = fields.taapStatus;
    const taapEntity = fields.taapEntity;
    const taapJopo = fields.taapJopo;
    return this.taapService.create(
      taapIntro,
      taapScoring,
      taapModifiedDate,
      taapStatus,
      taapEntity,
      taapJopo,
    );
  }

  @Put('/taap/:id')
  public async Updated(@Body() fields: any, @Param('id') taapId: number) {
    fields.taapId;
    const taapIntro = fields.taapIntro;
    const taapScoring = fields.taapScoring;
    const taapModifiedDate = fields.taapModifiedDate;
    const taapStatus = fields.taapStatus;
    const taapEntity = fields.taapEntity;
    const taapJopo = fields.taapJopo;
    return this.taapService.update(
      taapId,
      taapIntro,
      taapScoring,
      taapModifiedDate,
      taapStatus,
      taapEntity,
      taapJopo,
    );
  }

  @Delete('/taap/:id')
  delete(@Param('id') id: number) {
    return this.taapService.delete(id);
  }

  @Post('/taap/apply')
  public async Apply(@Body() fields: any) {
    return this.taapService.Apply(fields);
  }
}

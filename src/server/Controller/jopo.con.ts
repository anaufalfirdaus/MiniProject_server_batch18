import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { JopoService } from '../Services/jopo.srv';

@Controller()
export class JopoController {
  constructor(private jopoService: JopoService) {}

  @Get('/jopo')
  async GetAll() {
    return this.jopoService.findAll();
  }

  @Get('jopo/:id')
  public async GetOne(@Param('id') id: number) {
    return this.jopoService.findOne(id);
  }

  @Post('/jopo')
  async Create(@Body() fields: any) {
    const jopoNumber = fields.jopoNumber;
    const jopoTitle = fields.jopoTitle;
    const jopoMinSalary = fields.jopoMinSalary;
    const jopoMaxSalary = fields.jopoMaxSalary;
    const jopoDescription = fields.jopoDescription;
    const jopoResponsibility = fields.jopoResponsibility;
    const jopoTarget = fields.jopoTarget;
    const jopoBenefit = fields.jopoBenefit;
    const jopoStartDate = fields.jopoStartDate;
    const jopoEndDate = fields.jopoEndDate;
    const jopoPublishDate = fields.jopoPublishDate;
    const jopoModifiedDate = fields.jopoModifiedDate;
    const jopoEmpEntity = fields.jopoEmpEntity;
    const jopoClit = fields.jopoClit;
    const jopoJoro = fields.jopoJoro;
    const jopoJoty = fields.jopoJoty;
    const jopoJoca = fields.jopoJoca;
    const jopoStatus = fields.jopoStatus;
    const jopoMinExperience = fields.jopoMinExperience;
    const jopoSkill = fields.jopoSkill;
    const jopoMaxExperience = fields.jopoMaxExperience;
    return this.jopoService.create(
      jopoNumber,
      jopoTitle,
      jopoMinSalary,
      jopoMaxSalary,
      jopoDescription,
      jopoResponsibility,
      jopoTarget,
      jopoBenefit,
      jopoStartDate,
      jopoEndDate,
      jopoPublishDate,
      jopoModifiedDate,
      jopoEmpEntity,
      jopoClit,
      jopoJoro,
      jopoJoty,
      jopoJoca,
      jopoStatus,
      jopoMinExperience,
      jopoSkill,
      jopoMaxExperience,
    );
  }

  @Put('/jopo/:id')
  public async Updated(@Body() fields: any, @Param('id') jopoId: number) {
    fields.jopoId;
    const jopoNumber = fields.jopoNumber;
    const jopoTitle = fields.jopoTitle;
    const jopoMinSalary = fields.jopoMinSalary;
    const jopoMaxSalary = fields.jopoMaxSalary;
    const jopoDescription = fields.jopoDescription;
    const jopoResponsibility = fields.jopoResponsibility;
    const jopoTarget = fields.jopoTarget;
    const jopoBenefit = fields.jopoBenefit;
    const jopoStartDate = fields.jopoStartDate;
    const jopoEndDate = fields.jopoEndDate;
    const jopoPublishDate = fields.jopoPublishDate;
    const jopoModifiedDate = fields.jopoModifiedDate;
    const jopoEmpEntity = fields.jopoEmpEntity;
    const jopoClit = fields.jopoClit;
    const jopoJoro = fields.jopoJoro;
    const jopoJoty = fields.jopoJoty;
    const jopoJoca = fields.jopoJoca;
    const jopoStatus = fields.jopoStatus;
    const jopoMinExperience = fields.jopoMinExperience;
    const jopoSkill = fields.jopoSkill;
    const jopoMaxExperience = fields.jopoMaxExperience;
    return this.jopoService.update(
      jopoId,
      jopoNumber,
      jopoTitle,
      jopoMinSalary,
      jopoMaxSalary,
      jopoDescription,
      jopoResponsibility,
      jopoTarget,
      jopoBenefit,
      jopoStartDate,
      jopoEndDate,
      jopoPublishDate,
      jopoModifiedDate,
      jopoEmpEntity,
      jopoClit,
      jopoJoro,
      jopoJoty,
      jopoJoca,
      jopoStatus,
      jopoMinExperience,
      jopoSkill,
      jopoMaxExperience,
    );
  }

  @Put('/jopo/publish/:id')
  public async publish(@Body() fields: any, @Param('id') jopoId: number) {
    const jopo = await this.jopoService.findOne(jopoId);
    jopo.jopoStatus = 'published';
    return this.jopoService.update(
      jopo.jopoId,
      jopo.jopoNumber,
      jopo.jopoTitle,
      jopo.jopoMinSalary,
      jopo.jopoMaxSalary,
      jopo.jopoDescription,
      jopo.jopoResponsibility,
      jopo.jopoTarget,
      jopo.jopoBenefit,
      jopo.jopoStartDate,
      jopo.jopoEndDate,
      jopo.jopoPublishDate,
      jopo.jopoModifiedDate,
      jopo.jopoEmpEntity.empEntityId,
      jopo.jopoClit.clitId,
      jopo.jopoJoro.joroId,
      jopo.jopoJoty.jotyId,
      jopo.jopoJoca.jocaId,
      jopo.jopoStatus,
      jopo.jopoMinExperience,
      jopo.jopoSkill,
      jopo.jopoMaxExperience,
    );
  }

  @Put('/jopo/unpublish/:id')
  public async unPublish(@Body() fields: any, @Param('id') jopoId: number) {
    const jopo = await this.jopoService.findOne(jopoId);
    jopo.jopoStatus = 'unpublished';
    return this.jopoService.update(
      jopo.jopoId,
      jopo.jopoNumber,
      jopo.jopoTitle,
      jopo.jopoMinSalary,
      jopo.jopoMaxSalary,
      jopo.jopoDescription,
      jopo.jopoResponsibility,
      jopo.jopoTarget,
      jopo.jopoBenefit,
      jopo.jopoStartDate,
      jopo.jopoEndDate,
      jopo.jopoPublishDate,
      jopo.jopoModifiedDate,
      jopo.jopoEmpEntity.empEntityId,
      jopo.jopoClit.clitId,
      jopo.jopoJoro.joroId,
      jopo.jopoJoty.jotyId,
      jopo.jopoJoca.jocaId,
      jopo.jopoStatus,
      jopo.jopoMinExperience,
      jopo.jopoSkill,
      jopo.jopoMaxExperience,
    );
  }

  @Delete('/jopo/:id')
  delete(@Param('id') id: number) {
    return this.jopoService.delete(id);
  }
}

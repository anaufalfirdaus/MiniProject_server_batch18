import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { programEntityService } from '../Services/ProgramEntity.service';

@Controller('api/program_entity')
@Injectable()
export class programEntityController {
  constructor(private PEService: programEntityService) {}

  @Get()
  async GetAll() {
    return this.PEService.findAll();
  }

  @Get(':coreProgId')
  public async GetOne(@Param('coreProgId') id: number) {
    return this.PEService.findOne(id);
  }

  @Post('insertPE')
  public async create(@Body() fields: any) {
    return this.PEService.createPE(fields);
  }

  @Put('update_entity/:progId')
  public async Updated(@Body() fields: any, @Param('progId') progId: number) {
    const progTitle = fields.progTitle;
    const progHeadline = fields.progHeadline;
    const progType = fields.progType;
    const progLearningType = fields.progLearningType;
    const progRating = fields.progRating;
    const progTotalStudent = fields.progTotalStudent;
    // const progModifiedDate = fields.progModifiedDate;
    const progImage = fields.progImage;

    return this.PEService.updatePE(
      progId,
      progTitle,
      progHeadline,
      progType,
      progLearningType,
      progRating,
      progTotalStudent,
      // progModifiedDate,
      progImage,
    );
  }

  @Delete('DeletePE/:progId')
  public async Deleted(@Param('progId') progId: number) {
    return this.PEService.deletePE(progId);
  }
}

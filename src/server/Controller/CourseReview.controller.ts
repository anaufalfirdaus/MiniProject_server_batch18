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
import { courseReviewService } from '../Services/CourseReview.service';

@Controller('api/course_review')
@Injectable()
export class courseReviewController {
  constructor(private CRService: courseReviewService) {}

  @Get()
  public async GetAll() {
    return this.CRService.findAll();
  }

  @Get(':coreProgId')
  public async GetOne(@Param('coreProgId') id: number) {
    return this.CRService.findOne(id);
  }

  // @Post('/')
  // public async Create(@Body() fields: any) {
  //   const coreprogId = fields.coreProgId;
  //   const userEntityId = fields.coreEntityId;
  //   const coreReview = fields.coreReview;
  //   const coreRating = fields.coreRating;
  //   return this.CRService.createCR(
  //     coreprogId,
  //     userEntityId,
  //     coreReview,
  //     coreRating,
  //   );
  // }

  @Post('insert')
  public async create(@Body() fields: any) {
    return this.CRService.create(fields);
  }

  @Put('updateReview/:coreProgId/:coreEntityId')
  public async Updated(
    @Body() fields: any,
    @Param('coreProgId') coreProgId: number,
    @Param('coreEntityId') coreEntityId: number,
  ) {
    const newCoreEntityId = fields.coreEntityId;
    const coreReview = fields.coreReview;
    const coreRating = fields.coreRating;

    return this.CRService.updateCR(
      coreProgId,
      coreEntityId,
      newCoreEntityId,
      coreReview,
      coreRating,
    );
  }
  // @Delete('coreProgId')
  // public async Deleted(@Param('coreProgId') coreProgId: number) {
  //   return this.CRService.deleteCR(coreProgId);
  // }

  // p2

  // @Delete(':coreProgId/:coreEntityId')
  // public async Deleted(@Body() fields: any) {
  //   const coreProgId = fields.coreProgId;
  //   const coreEntityId = fields.coreEntityId;

  //   return this.CRService.deleteCR(coreProgId, coreEntityId);
  //
  @Delete('review')
  public async delete(@Body() fields: any) {
    return this.CRService.deleteCR(fields.coreProgId, fields.coreEntityId);
  }
}

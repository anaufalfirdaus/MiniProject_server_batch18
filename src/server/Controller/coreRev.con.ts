import {
    Body,
    Controller,
    Delete,
    Get,
    Injectable,
    Param,
    UseGuards,
    Post,
    Put,
  } from '@nestjs/common';

  import { CoreRevService } from '../Services/coreRev.srv';
  

  @Controller()
  export class CoreRevController {
    constructor(private coreRevService: CoreRevService) {}

    @Get('/course_review')
    async GetAll() {
      return this.coreRevService.findAll();
    }

    @Get('course_review/:id')
    public async GetOne(@Param('id') id: number) {
    return this.coreRevService.findOne(id);
  }

   @Post('/course_review/')
   async Create(@Body() fields:any){
    const coreProg = fields.coreProg;
    const coreEntity = fields.coreEntity;
    const coreReview = fields.coreReview;
    const coreRating = fields.coreRating;
    return this.coreRevService.create(
        coreProg,
        coreEntity,
        coreReview,
        coreRating,
    )
   }

   @Put('/course_review/:id/:idd')
   public async Updated(@Body() fields: any, @Param('id') corseProgId: number, @Param('idd') userEntityId:number) {
    fields.corseProgId;
    const coreEntity = fields.userEntityId;
    const coreReview = fields.coreReview;
    const coreRating = fields.coreRating;
     return this.coreRevService.update(
        corseProgId,
        coreEntity,
        coreReview,
        coreRating,
        );
   }

   @Delete('/course_review/:id')
   delete(@Param('id') id: number) {
    return this.coreRevService.delete(id);
  }

}
import { Controller, Get, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { CurriculumService } from '../Services/curriculum.service';

@Controller('curriculums')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  @Get()
  private getCurriculums() {
    return this.curriculumService.getAll();
  }

  @Delete(':id')
  private removeCurriculum(@Param('id', ParseIntPipe) id: number) {
    return this.curriculumService.removeById(id);
  }
}

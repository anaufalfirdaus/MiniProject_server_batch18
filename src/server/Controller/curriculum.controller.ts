import { Controller, Get } from '@nestjs/common';
import { CurriculumService } from '../Services/curriculum.service';

@Controller('curriculums')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  @Get()
  private getCurriculums() {
    return this.curriculumService.getAll();
  }
}

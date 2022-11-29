import { Controller, Get, Injectable } from '@nestjs/common';
import { ProgramService } from '../Services/program.srv';

@Controller('api/program')
@Injectable()
export class ProgramController {
  constructor(private program: ProgramService) {}

  @Get('/bootcamp')
  public async getBootcamp() {
    return this.program.getBootcamp();
  }

  @Get('/course')
  public async getCourse() {
    return this.program.getCourse();
  }
}

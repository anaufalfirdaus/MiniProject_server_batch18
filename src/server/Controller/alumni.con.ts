import { Controller, Get, Injectable } from '@nestjs/common';
import { AlumniService } from '../Services/alumni.srv';

@Controller('api/alumni')
@Injectable()
export class AlumniController {
  constructor(private alumni: AlumniService) {}

  @Get('/story')
  public async getStory() {
    return this.alumni.getSuccessStory();
  }

  @Get('/testi')
  public async getTesti() {
    return this.alumni.getTestimony();
  }

  // @Get('/batch')
  // public async getBatch() {
  //   return this.alumni.getBatchAlumni();
  // }
}

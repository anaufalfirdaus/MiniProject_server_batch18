import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramEntity } from '../../entities/ProgramEntity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(ProgramEntity) private program: Repository<ProgramEntity>,
  ) {}

  public async getBootcamp() {
    return await this.program.find({
      where: {
        progType: 'bootcamp',
      },
      order: {
        progModifiedDate: 'desc',
      },
    });
  }

  public async getCourse() {
    return await this.program.find({
      where: {
        progType: 'course',
      },
      order: {
        progModifiedDate: 'desc',
      },
    });
  }
}

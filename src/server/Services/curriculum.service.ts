import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from '../../entities/ProgramEntity';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(ProgramEntity)
    private curriculumRepo: Repository<ProgramEntity>,
  ) {}

  async getAll(): Promise<ProgramEntity[] | []> {
    return await this.curriculumRepo.find({
      relations: {
        progCity: true,
        progCate: true,
      },
    });
  }
}

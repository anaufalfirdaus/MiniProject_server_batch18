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

  async removeById(id: number) {
    const curriculum = await this.curriculumRepo.findOne({
      where: { progId: id },
    });
    const remCurriculum = await this.curriculumRepo.remove(curriculum);

    if (remCurriculum) {
      return { id: id };
    }
    return {
      info: 'Failed',
      message: 'Something went wrong, please try again later',
    };
  }
}

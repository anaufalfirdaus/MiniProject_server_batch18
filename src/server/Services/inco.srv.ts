import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstructorCourse } from '../../entities/InstructorCourse';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorCoursesServices {
  constructor(
    @InjectRepository(InstructorCourse)
    private incoRepo: Repository<InstructorCourse>,
  ) {}

  public async findAll() {
    return await this.incoRepo.find({
      relations: {
        incoEntity: {
          empEntity: true,
        },
      },
    });
  }

  public async findOne(id) {
    return await this.incoRepo.findOne({
      relations: {
        incoEntity: {
          empEntity: true,
        },
      },
      where: { incoId: id },
    });
  }
}

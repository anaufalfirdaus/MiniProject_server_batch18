import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courses } from '../../entities/Courses';

@Injectable()
export class CoursesServices {
  constructor(
    @InjectRepository(Courses)
    private corseRepo: Repository<Courses>,
  ) {}

  public async findAll() {
    return await this.corseRepo.find();
  }

  public async findOne(id) {
    return await this.corseRepo.findOne({
      where: { corseProgId: id },
    });
  }
}

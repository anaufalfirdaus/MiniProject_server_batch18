import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseReview } from '../../entities/CourseReview';

@Injectable()
export class CoreServices {
  constructor(
    @InjectRepository(CourseReview)
    private coreRepo: Repository<CourseReview>,
  ) {}

  public async findAll() {
    return await this.coreRepo.find({
      relations: { coreProg: true, coreEntity: true },
    });
  }

  public async findOne(id) {
    return await this.coreRepo.findOne({
      relations: { coreProg: true, coreEntity: true },
      where: { coreProgId: id },
    });
  }
}

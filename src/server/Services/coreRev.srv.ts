import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseReview } from '../../entities/CourseReview';
import { Repository } from 'typeorm';

@Injectable()
export class CoreRevService {
  constructor(
    @InjectRepository(CourseReview) private CoreRevRepo: Repository<CourseReview>,
    private jwtService: JwtService,
  ) {}

  public async findAll() {
    return await this.CoreRevRepo.find({
        relations: ['coreEntity', 'coreProg'],
        select: { coreEntity: { userEntityId: true }, coreProg: { corseProgId: true } },
    });
  }

  public async findOne(id: any) {
    return await this.CoreRevRepo.findOne({
      where: { coreProgId: id },
    });
  }

  public async create(
    corseProgId: number,
    userEntityId: number,
    coreReview: string,
    coreRating: number,
  ) {
    const create_taap = await this.CoreRevRepo.create({
      coreProg: { corseProgId },
      coreEntity: { userEntityId },
      coreReview,
      coreRating
    });
    return await this.CoreRevRepo.save(create_taap);
  }

  public async update(
    corseProgId: number,
    userEntityId: number,
    coreReview: string,
    coreRating: number
  ) {
    return await this.CoreRevRepo.update(corseProgId, {
        coreProg: {corseProgId},
        coreEntity: { userEntityId },
        coreReview,
        coreRating
    });
  }

  async delete(id:number) {
    try {
      const jopo = await this.CoreRevRepo.delete(id);
      return 'Delete' + jopo.affected + 'rows';
    } catch (error) {
      return error.message;
    }
  }

}

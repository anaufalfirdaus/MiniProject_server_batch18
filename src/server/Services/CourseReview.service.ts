import { Injectable } from '@nestjs/common';
import { Repository, Timestamp } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseReview } from '../../entities/CourseReview';

@Injectable()
export class courseReviewService {
  constructor(
    @InjectRepository(CourseReview)
    private courseReviewRepository: Repository<CourseReview>,
  ) {}

  async findAll(): Promise<CourseReview[]> {
    const courseReviewFindAll = await this.courseReviewRepository.find({
      relations: { coreEntity: true },
    });
    return courseReviewFindAll;
  }

  async findOne(id: number): Promise<CourseReview> {
    try {
      return await this.courseReviewRepository.findOne({
        where: { coreProgId: id },
      });
    } catch (error) {
      return error;
    }
  }
  // async createCR(
  //   newCoreProgId: number,
  //   coreEntityId: number,
  //   coreReview: string,
  //   coreRating: number,
  // ) {
  //   const createCourseReview = await this.courseReviewRepository.create(newCoreProgId,{
  //    {
  //     coreEntityId,
  //     coreReview,
  //     coreRating
  //   }
  //   });
  //   return await this.courseReviewRepository.save(createCourseReview);
  // }

  // async createCR(
  //   newCoreProgId: number,
  //   userEntityId: number,
  //   coreReview: string,
  //   coreRating: number,
  // ) {
  //   return await this.courseReviewRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(CourseReview)
  //     .values({
  //       coreProgId: newCoreProgId,
  //       coreEntityId: userEntityId,
  //       coreReview: coreReview,
  //       coreRating: coreRating,
  //     })
  //     .execute();
  // }

  public async create(fields) {
    try {
      const corev = await this.courseReviewRepository.save({
        coreProgId: fields.coreProgId,
        coreEntityId: fields.coreEntityId,
        coreReview: fields.coreReview,
        coreRating: fields.coreRating,
      });
      return corev;
    } catch (error) {
      return error.message;
    }
  }
  // async updateCR(
  //   coreProgId: number,
  //   coreEntityId: number,
  //   coreReview: string,
  //   coreRating: number,
  //   coreModifiedDate: any,
  // ) {
  //   return await this.courseReviewRepository.update(coreProgId, {
  // coreEntityId,
  // coreReview,
  // coreRating,
  //     coreModifiedDate,
  //   });
  // }

  async updateCR(
    coreProgId: number,
    coreEntityId: number,
    newCoreEntityId: number,
    coreReview: string,
    coreRating: number,
  ) {
    return await this.courseReviewRepository
      .createQueryBuilder()
      .update()
      .set({
        coreProgId: coreProgId,
        coreEntityId: newCoreEntityId,
        coreReview: coreReview,
        coreRating: coreRating,
        coreModifiedDate: new Date(Date.now()).toISOString(),
      })
      .where('coreProgId = :id', { id: coreProgId })
      .andWhere('coreEntity = :idd', { idd: coreEntityId })
      .execute();
  }

  //   .update(coreProgId, {
  //     coreEntityId,
  //     coreReview,
  //     coreRating,
  //     coreModifiedDate,
  //   });
  // }

  async deleteCR(coreProgId, coreEntityId) {
    try {
      return await this.courseReviewRepository
        .createQueryBuilder()
        .delete()
        .where('coreProgId = :id', { id: coreProgId })
        .andWhere('coreEntity = :idd', { idd: coreEntityId })
        .execute();
    } catch (error) {
      return error;
    }
  }
}

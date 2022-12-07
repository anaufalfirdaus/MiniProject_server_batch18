import { Injectable } from '@nestjs/common';
import { Repository, Timestamp } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramEntity } from '../../entities/ProgramEntity';

@Injectable()
export class programEntityService {
  constructor(
    @InjectRepository(ProgramEntity)
    private programEntityRepository: Repository<ProgramEntity>,
  ) {}

  async findAll(): Promise<ProgramEntity[]> {
    const programEntityFindAll = await this.programEntityRepository.find({
      relations: ['progCity', 'progCate'],
      select: { progCity: { cityId: true }, progCate: { cateId: true } },
      order: {
        progId: 'ASC', // "DESC"
      },
    });
    return programEntityFindAll;
  }

  async findOne(id: number): Promise<ProgramEntity> {
    try {
      return await this.programEntityRepository.findOne({
        relations: ['progCity', 'progCate'],
        select: { progCity: { cityId: true }, progCate: { cateId: true } },
        where: { progId: id },
      });
    } catch (error) {
      return error;
    }
  }

  async createPE(fields) {
    try {
      const createProgramEntity = await this.programEntityRepository.save({
        progId: fields.progId,
        progTitle: fields.progTitle,
        progHeadline: fields.progHeadline,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalStudent: fields.progTotalStudent,
        progModifiedDate: fields.progModifiedDate,
        progImage: fields.progImage,
        progCity: fields.progCity,
        progCate: fields.progCate,
      });

      return createProgramEntity;
    } catch (error) {
      return error.message;
    }
  }

  async updatePE(
    progId: number,
    progTitle: string,
    progHeadline: string,
    progType: string,
    progLearningType: string,
    progRating: string,
    progTotalStudent: number,
    progImage: string,
  ) {
    return await this.programEntityRepository
      .createQueryBuilder()
      .update()
      .set({
        progId: progId,
        progTitle: progTitle,
        progHeadline: progHeadline,
        progType: progType,
        progLearningType: progLearningType,
        progRating: progRating,
        progTotalStudent: progTotalStudent,
        progModifiedDate: new Date(Date.now()).toISOString(),
        progImage: progImage,
      })
      .where('progId = :id', { id: progId })
      .execute();
  }

  async deletePE(progId: number) {
    try {
      return this.programEntityRepository.delete(progId);
    } catch (error) {
      return error;
    }
  }
}

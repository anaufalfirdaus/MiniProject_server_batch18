import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategory } from '../../entities/JobCategory';

@Injectable()
export class JobCategoryService {
  constructor(
    @InjectRepository(JobCategory)
    private jobCategoryRepo: Repository<JobCategory>,
  ) {}

  public async findAll() {
    return await this.jobCategoryRepo.find();
  }

  public async findOne(id) {
    return await this.jobCategoryRepo.findOne({ where: { jocaId: id } });
  }

  public async create(fields) {
    try {
      const jobCategory = await this.jobCategoryRepo.save({
        jocaId: fields.jocaId,
        jocaName: fields.jocaName,
        jocaModifiedDate: fields.jocaModifiedDate,
      });
      return jobCategory;
    } catch (error) {
      return error.message;
    }
  }

  public async update(id, fields) {
    try {
      await this.jobCategoryRepo.update(id, {
        jocaId: fields.jocaId,
        jocaName: fields.jocaName,
        jocaModifiedDate: fields.jocaModifiedDate,
      });
      return await this.jobCategoryRepo.findOne({ where: { jocaId: id } });
    } catch (error) {
      return error.message;
    }
  }

  async delete(id) {
    try {
      const jobType = await this.jobCategoryRepo.delete(id);
      return 'Deleted' + jobType.affected + ' rows';
    } catch (error) {
      return error.message;
    }
  }
}

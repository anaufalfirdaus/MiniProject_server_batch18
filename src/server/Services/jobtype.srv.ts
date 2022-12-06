import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobType } from '../../entities/JobType';

@Injectable()
export class JobTypeService {
  constructor(
    @InjectRepository(JobType) private jobTypeRepo: Repository<JobType>,
  ) {}

  public async findAll() {
    return await this.jobTypeRepo.find();
  }

  public async findOne(id) {
    return await this.jobTypeRepo.findOne({ where: { jotyId: id } });
  }

  public async create(fields) {
    try {
      const jobType = await this.jobTypeRepo.save({
        jotyId: fields.jotyId,
        jotyName: fields.jotyName,
      });
      return jobType;
    } catch (error) {
      return error.message;
    }
  }

  public async update(id, fields) {
    try {
      await this.jobTypeRepo.update(id, {
        jotyId: fields.jotyId,
        jotyName: fields.jotyName,
      });
      return await this.jobTypeRepo.findOne({ where: { jotyId: id } });
    } catch (error) {
      return error.message;
    }
  }

  async delete(id) {
    try {
      const jobType = await this.jobTypeRepo.delete(id);
      return 'Deleted' + jobType.affected + ' rows';
    } catch (error) {
      return error.message;
    }
  }
}

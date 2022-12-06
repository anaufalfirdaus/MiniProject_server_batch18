import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRole } from '../../entities/JobRole';

@Injectable()
export class JobRoleService {
  constructor(
    @InjectRepository(JobRole) private jobRoleRepo: Repository<JobRole>,
  ) {}

  public async findAll() {
    return await this.jobRoleRepo.find();
  }

  public async findOne(id) {
    return await this.jobRoleRepo.findOne({ where: { joroId: id } });
  }

  public async create(fields) {
    try {
      const jobRole = await this.jobRoleRepo.save({
        joroId: fields.joroId,
        joroName: fields.joroName,
        joroModifiedDate: fields.joroModifiedDate,
      });
      return jobRole;
    } catch (error) {
      return error.message;
    }
  }

  public async update(id, fields) {
    try {
      await this.jobRoleRepo.update(id, {
        joroId: fields.joroId,
        joroName: fields.joroName,
        joroModifiedDate: fields.joroModifiedDate,
      });
      return await this.jobRoleRepo.findOne({ where: { joroId: id } });
    } catch (error) {
      return error.message;
    }
  }

  async delete(id) {
    try {
      const jobRole = await this.jobRoleRepo.delete(id);
      return 'Deleted' + jobRole.affected + ' rows';
    } catch (error) {
      return error.message;
    }
  }
}

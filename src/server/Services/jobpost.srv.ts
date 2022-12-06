import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from '../../entities/JobPost';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost) private jobPostRepo: Repository<JobPost>,
  ) {}

  public async findAll() {
    const jobposts = await this.jobPostRepo.find({
      relations: {
        jopoClit: true,
        jopoEmpEntity: true,
        jopoJoca: true,
        jopoJoro: true,
        jopoJoty: true,
      },
    });

    return jobposts;
  }

  public async findOne(id) {
    const jobpost = await this.jobPostRepo.find({
      relations: {
        jopoClit: true,
        jopoEmpEntity: true,
        jopoJoca: true,
        jopoJoro: true,
        jopoJoty: true,
      },
      where: {
        jopoId: id,
      },
    });

    return jobpost;
  }

  public async create(fields) {
    try {
      const jobPost = await this.jobPostRepo.save({
        jopoId: fields.jopoId,
        jopoNumber: fields.jopoNumber,
        jopoTitle: fields.jopoTitle,
        jopoMinSalary: fields.jopoMinSalary,
        jopoMaxSalary: fields.jopoMaxSalary,
        jopoMinExperience: fields.jopoMinExperience,
        jopoMaxExperience: fields.jopoMaxExperience,
        jopoDescription: fields.jopoDescription,
        jopoResponsibility: fields.jopoResponsibility,
        jopoTarget: fields.jopoTarget,
        jopoBenefit: fields.jopoBenefit,
        jopoStartDate: fields.jopoStartDate,
        jopoPublishDate: fields.jopoPublishDate,
        jopoModifiedDate: fields.jopoModifiedDate,
        jopoStatus: fields.jopoStatus,
        jopoClit: fields.jopoClit,
        jopoEmpEntity: fields.jopoEmpEntity,
        jopoJoca: fields.jopoJoca,
        jopoJoro: fields.jopoJoro,
        jopoJoty: fields.jopoJoty,
        talentApplies: fields.talentApplies,
      });
      return jobPost;
    } catch (error) {
      return error.message;
    }
  }

  public async update(id, fields) {
    try {
      await this.jobPostRepo.update(id, {
        jopoId: fields.jopoId,
        jopoNumber: fields.jopoNumber,
        jopoTitle: fields.jopoTitle,
        jopoMinSalary: fields.jopoMinSalary,
        jopoMaxSalary: fields.jopoMaxSalary,
        jopoMinExperience: fields.jopoMinExperience,
        jopoMaxExperience: fields.jopoMaxExperience,
        jopoDescription: fields.jopoDescription,
        jopoResponsibility: fields.jopoResponsibility,
        jopoTarget: fields.jopoTarget,
        jopoBenefit: fields.jopoBenefit,
        jopoStartDate: fields.jopoStartDate,
        jopoPublishDate: fields.jopoPublishDate,
        jopoModifiedDate: fields.jopoModifiedDate,
        jopoStatus: fields.jopoStatus,
        jopoClit: fields.jopoClit,
        jopoEmpEntity: fields.jopoEmpEntity,
        jopoJoca: fields.jopoJoca,
        jopoJoro: fields.jopoJoro,
        jopoJoty: fields.jopoJoty,
        talentApplies: fields.talentApplies,
      });
      return await this.jobPostRepo.findOne({ where: { jopoId: id } });
    } catch (error) {
      return error.message;
    }
  }

  async delete(id) {
    try {
      const jobPost = await this.jobPostRepo.delete(id);
      return 'Deleted' + jobPost.affected + ' rows';
    } catch (error) {
      return error.message;
    }
  }
}

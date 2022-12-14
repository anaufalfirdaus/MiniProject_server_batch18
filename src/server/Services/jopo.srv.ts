import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost } from '../../entities/JobPost';
import { Repository } from 'typeorm';

@Injectable()
export class JopoService {
  constructor(
    @InjectRepository(JobPost) private jopoRepo: Repository<JobPost>,
    private jwtService: JwtService,
  ) {}

  // public async findAll() {
  //   return await this.jopoRepo.find({
  //     relations: [
  //       'jopoEmpEntity',
  //       'jopoClit',
  //       'jopoJoca',
  //       'jopoJoro',
  //       'jopoJoty',
  //     ],
  //     select: {
  //       jopoEmpEntity: { empEntityId: true },
  //       jopoClit: { clitId: true },
  //       jopoJoca: { jocaId: true },
  //       jopoJoro: { joroId: true },
  //       jopoJoty: { jotyId: true },
  //     },
  //   });
  // }

  public async findAll() {
    return await this.jopoRepo.find({
      relations: {
        jopoEmpEntity: true,
        jopoClit: true,
        jopoJoca: true,
        jopoJoro: true,
        jopoJoty: true,
      },
    });
  }

  public async findOne(id: any) {
    return await this.jopoRepo.findOne({
      relations: [
        'jopoEmpEntity',
        'jopoClit',
        'jopoJoca',
        'jopoJoro',
        'jopoJoty',
      ],
      select: {
        jopoEmpEntity: { empEntityId: true },
        jopoClit: { clitId: true },
        jopoJoca: { jocaId: true },
        jopoJoro: { joroId: true },
        jopoJoty: { jotyId: true },
      },
      where: { jopoId: id },
    });
  }

  public async create(
    jopoNumber: string,
    jopoTitle: string,
    jopoMinSalary: number,
    jopoMaxSalary: number,
    jopoDescription: object,
    jopoResponsibility: object,
    jopoTarget: object,
    jopoBenefit: object,
    jopoStartDate: Date,
    jopoEndDate: Date,
    jopoPublishDate: Date,
    jopoModifiedDate: Date,
    empEntityId: number,
    clitId: number,
    joroId: number,
    jotyId: number,
    jocaId: number,
    jopoStatus: string,
    jopoMinExperience: number,
    jopoSkill: string,
    jopoMaxExperience: number,
  ) {
    const create_jopo = await this.jopoRepo.create({
      jopoNumber,
      jopoTitle,
      jopoMinSalary,
      jopoMaxSalary,
      jopoDescription,
      jopoResponsibility,
      jopoTarget,
      jopoBenefit,
      jopoStartDate,
      jopoEndDate,
      jopoPublishDate,
      jopoModifiedDate,
      jopoEmpEntity: { empEntityId },
      jopoClit: { clitId },
      jopoJoro: { joroId },
      jopoJoty: { jotyId },
      jopoJoca: { jocaId },
      jopoStatus,
      jopoMinExperience,
      jopoSkill,
      jopoMaxExperience,
    });
    return await this.jopoRepo.save(create_jopo);
  }

  public async update(
    jopoId: number,
    jopoNumber: string,
    jopoTitle: string,
    jopoMinSalary: number,
    jopoMaxSalary: number,
    jopoDescription: object,
    jopoResponsibility: object,
    jopoTarget: object,
    jopoBenefit: object,
    jopoStartDate: Date,
    jopoEndDate: Date,
    jopoPublishDate: Date,
    jopoModifiedDate: Date,
    empEntityId: number,
    clitId: number,
    joroId: number,
    jotyId: number,
    jocaId: number,
    jopoStatus: string,
    jopoMinExperience: number,
    jopoSkill: string,
    jopoMaxExperience: number,
  ) {
    return await this.jopoRepo.update(jopoId, {
      jopoId,
      jopoNumber,
      jopoTitle,
      jopoMinSalary,
      jopoMaxSalary,
      jopoDescription,
      jopoResponsibility,
      jopoTarget,
      jopoBenefit,
      jopoStartDate,
      jopoEndDate,
      jopoPublishDate,
      jopoModifiedDate,
      jopoEmpEntity: { empEntityId },
      jopoClit: { clitId },
      jopoJoro: { joroId },
      jopoJoty: { jotyId },
      jopoJoca: { jocaId },
      jopoStatus,
      jopoMinExperience,
      jopoSkill,
      jopoMaxExperience,
    });
  }

  async delete(id: number) {
    try {
      await this.jopoRepo.delete(id);
      return { jopoId: id };
    } catch (error) {
      return error.message;
    }
  }
}

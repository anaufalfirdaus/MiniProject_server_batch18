import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TalentApply } from '../../entities/TalentApply';
import { Users } from '../../entities/Users';
import { UsersEducation } from '../../entities/UsersEducation';
import { UsersMedia } from '../../entities/UsersMedia';
import { UsersPhones } from '../../entities/UsersPhones';
import { Repository } from 'typeorm';

@Injectable()
export class TaapService {
  constructor(
    @InjectRepository(TalentApply) private taapRepo: Repository<TalentApply>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(UsersEducation) private usduRepo: Repository<UsersEducation>,
    @InjectRepository(UsersMedia) private usmeRepo: Repository<UsersMedia>,
    @InjectRepository(UsersPhones) private usphoRepo: Repository<UsersPhones>,
    private jwtService: JwtService,
  ) {}

  public async Apply(fields: any) {
    try {
      await this.taapRepo
        .createQueryBuilder()
        .update()
        .set({
          taapIntro: fields.taapIntro,
          taapScoring: fields.taapScoring,
          //userPhoto: fields.userPhoto,
          taapModifiedDate: new Date(),
          taapStatus: fields.taapStatus,
          taapEntity: fields.taapEntity,
          taapJopo: fields.taapJopo,
        })
        .execute();

      await this.userRepo
        .createQueryBuilder()
        .update()
        .set({
          userFirstName: fields.userFirstName,
          userLastName: fields.userLastName,
          userModifiedDate: new Date(),
        })
        .where('userEntityId=:id', { id: fields.userEntityId })
        .execute();

      await this.usduRepo.save({
        usduDegree: fields.usduDegree,
        usduSchool: fields.usduSchool,
        usduFieldStudy: fields.usduFieldStudy,
        usduModifiedDate: new Date(),
      });

      await this.usphoRepo.save({
        uspoEntityId: fields.userEntityId,
        uspoNumber: fields.uspoNumber,
        uspoPontyCode: fields.uspoPontyCode,
        uspoModifiedDate: new Date(),
      });

      await this.usmeRepo.save({
        usmeEntityId: fields.userEntityId,
        usmeFilename: fields.usmeFilename,
        usmeFileLink: fields.usmeFileLink,
        usmeFilesize: fields.usmeFilesize,
        usmeFiletype: fields.usmeFiletype,
        usmeModifiedDate: new Date(),
      });
    } catch (error) {
      return error.message;
    }
  }

  public async findAll() {
    return await this.taapRepo.find({
      relations: ['taapEntity', 'taapJopo'],
      select: {
        taapEntity: { userEntityId: true, userPhoto: true },
        taapJopo: { jopoId: true },
      },
    });
  }

  public async getAllUser() {
    return await this.userRepo.find({
      relations: {
        usersEducations: true,
      },
    });
  }

  public async findOne(id: any) {
    return await this.taapRepo.findOne({
      where: { taapId: id },
    });
  }

  public async create(
    taapIntro: string,
    taapScoring: number,
    taapModifiedDate: Date,
    taapStatus: string,
    userEntityId: number,
    jopoId: number,
  ) {
    const create_taap = await this.taapRepo.create({
      taapIntro,
      taapScoring,
      taapModifiedDate: new Date(Date.now()).toISOString(),
      taapStatus,
      taapEntity: { userEntityId },
      taapJopo: { jopoId },
    });
    return await this.taapRepo.save(create_taap);
  }

  public async update(
    taapId: number,
    taapIntro: string,
    taapScoring: number,
    taapModifiedDate: Date,
    taapStatus: string,
    userEntityId: number,
    jopoId: number,
  ) {
    return await this.taapRepo.update(taapId, {
      taapId,
      taapIntro,
      taapScoring,
      taapModifiedDate,
      taapStatus,
      taapEntity: { userEntityId },
      taapJopo: { jopoId },
    });
  }

  async delete(id: number) {
    try {
      const jopo = await this.taapRepo.delete(id);
      return 'Delete' + jopo.affected + 'rows';
    } catch (error) {
      return error.message;
    }
  }
}

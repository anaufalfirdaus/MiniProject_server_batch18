import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TalentApply } from '../../entities/TalentApply';
import { Repository } from 'typeorm';

@Injectable()
export class TaapService {
  constructor(
    @InjectRepository(TalentApply) private taapRepo: Repository<TalentApply>,
    private jwtService: JwtService,
  ) {}

  public async findAll() {
    return await this.taapRepo.find({
      relations: ['taapEntity', 'taapJopo'],
      select: {
        taapEntity: { userEntityId: true },
        taapJopo: { jopoId: true },
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
      taapModifiedDate,
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

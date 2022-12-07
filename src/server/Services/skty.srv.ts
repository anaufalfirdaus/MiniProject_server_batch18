import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillType } from '../../entities/SkillType';

@Injectable()
export class SkillTypeServices {
  constructor(
    @InjectRepository(SkillType)
    private sktyRepo: Repository<SkillType>,
  ) {}

  public async findAll() {
    return await this.sktyRepo.find();
  }

  public async findOne(id) {
    return await this.sktyRepo.findOne({ where: { sktyName: id } });
  }
}

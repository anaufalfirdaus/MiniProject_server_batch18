import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillTemplate } from '../../entities/SkillTemplate';

@Injectable()
export class SkillTemplateServices {
  constructor(
    @InjectRepository(SkillTemplate)
    private skteRepo: Repository<SkillTemplate>,
  ) {}

  public async findAll() {
    return await this.skteRepo.find();
  }

  public async findOne(id) {
    return await this.skteRepo.findOne({ where: { skteId: id } });
  }
}

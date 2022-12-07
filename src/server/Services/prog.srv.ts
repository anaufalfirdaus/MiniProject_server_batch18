import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from '../../entities/ProgramEntity';

@Injectable()
export class ProgramEntitiesServices {
  constructor(
    @InjectRepository(ProgramEntity)
    private progRepo: Repository<ProgramEntity>,
  ) {}

  public async findAll() {
    return await this.progRepo.find();
  }

  public async findOne(id) {
    return await this.progRepo.findOne({
      where: { progId: id },
    });
  }
}

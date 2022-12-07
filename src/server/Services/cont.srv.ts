import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contents } from '../../entities/Contents';

@Injectable()
export class ContentsServices {
  constructor(
    @InjectRepository(Contents)
    private contRepo: Repository<Contents>,
  ) {}

  public async findAll() {
    return await this.contRepo.find();
  }

  public async findOne(id) {
    return await this.contRepo.findOne({
      where: { contId: id },
    });
  }
}

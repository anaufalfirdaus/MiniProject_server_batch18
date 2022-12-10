import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentSectionMaterial } from '../../entities/ContentSectionMaterial';
import { Repository } from 'typeorm';

@Injectable()
export class CosmServices {
  constructor(
    @InjectRepository(ContentSectionMaterial)
    private cosmRepo: Repository<ContentSectionMaterial>,
  ) {}

  public async findAll() {
    return await this.cosmRepo.find({
      relations: {
        cosmCose: {
          coseCont: {
            contProg: {
              corseProg: true,
            },
          },
        },
      },
    });
  }

  public async findOne(id) {
    return await this.cosmRepo.findOne({
      relations: {
        cosmCose: {
          coseCont: {
            contProg: {
              corseProg: true,
            },
          },
        },
      },
      where: { cosmId: id },
    });
  }
}

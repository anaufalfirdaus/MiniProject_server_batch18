import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/Client';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  public async findAll() {
    return await this.clientRepo.find({
      relations: {
        clitAddr: true,
        clitEmra: true,
        jobPosts: true,
      },
    });
  }

  public async findOne(id) {
    // return await this.clientRepo.findOne({ where: { clitId: id } });
    return await this.clientRepo.findOne({
      relations: {
        clitAddr: true,
        clitEmra: true,
        jobPosts: true,
      },
      where: {
        clitId: id,
      },
    });
  }

  public async create(file, fields) {
    try {
      if (file) {
        const client = await this.clientRepo.save({
          clitId: fields.clitId,
          clitName: fields.clitName,
          clitAbout: fields.clitAbout,
          clitModifiedDate: fields.clitModifiedDate,
          clitAddr: fields.clitAddr,
          clitEmra: fields.clitEmra,
          clitLogo: file.clitLogo ? file.clitLogo[0].originalName : null,
        });
        return client;
      }
    } catch (error) {
      return error.message;
    }
  }

  public async update(id, fields) {
    try {
      await this.clientRepo.update(id, {
        clitId: fields.clitId,
        clitName: fields.clitName,
        clitAbout: fields.clitAbout,
        clitModifiedDate: fields.clitModifiedDate,
        clitAddr: fields.clitAddr,
        clitEmra: fields.clitEmra,
      });
      return await this.clientRepo.findOne({ where: { clitId: id } });
    } catch (error) {
      return error.message;
    }
  }

  async delete(id) {
    try {
      const client = await this.clientRepo.delete(id);
      return 'Deleted' + client.affected + ' rows';
    } catch (error) {
      return error.message;
    }
  }
}

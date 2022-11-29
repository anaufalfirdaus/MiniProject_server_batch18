import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../entities/Client';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private ClientRepo: Repository<Client>,
  ) {}

  async getAll(): Promise<Client[]> {
    const client = await this.ClientRepo.find({
      order: {
        clitModifiedDate: 'desc',
      },
    });
    return client;
  }
}

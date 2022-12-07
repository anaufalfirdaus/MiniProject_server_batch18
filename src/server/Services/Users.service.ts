import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users';

@Injectable()
export class usersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    const usersFindAll = await this.usersRepository.find();
    return usersFindAll;
  }

  async findOne(userEntityId: number): Promise<Users> {
    try {
      return await this.usersRepository.findOne({
        where: { userEntityId: userEntityId },
      });
    } catch (error) {
      return error;
    }
  }
}

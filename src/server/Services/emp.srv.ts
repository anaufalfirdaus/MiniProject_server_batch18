import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../entities/Employee';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
  ) {}

  public async findAll() {
    return await this.empRepo.find();
  }

  public async findOne(id) {
    return await this.empRepo.findOne({
      where: { empEntityId: id },
    });
  }
}

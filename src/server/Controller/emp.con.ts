import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from '../Services/emp.srv';

@Controller('api/employee')
export class EmpControll {
  constructor(private empServices: EmployeeService) {}
  @Get()
  public async getAll() {
    return await this.empServices.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return await this.empServices.findOne(id);
  }
}

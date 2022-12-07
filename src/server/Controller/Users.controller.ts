import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { usersService } from '../Services/Users.service';

@Controller('api/users')
@Injectable()
export class usersController {
  constructor(private usersService: usersService) {}

  @Get()
  public async GetAll() {
    return this.usersService.findAll();
  }

  @Get(':userEntityId')
  public async GetOne(@Param('userEntityId') userEntityId: number) {
    return this.usersService.findOne(userEntityId);
  }
}

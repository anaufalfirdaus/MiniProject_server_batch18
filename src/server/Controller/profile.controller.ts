import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';
import { ProfileService } from '../Services/profile.service';
import { AddEmailDto } from './profile/dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @Get('fetch')
  getProfile(@GetUser('userEntityId') userId: number) {
    return this.profile.getProfile(userId);
  }

  @Patch('user')
  updateUser(@GetUser('userEntityId') userId: number, @Body() userUpdate: any) {
    return this.profile.updateUser(userId, userUpdate);
  }

  @Patch('password')
  updatePassword(
    @GetUser('userEntityId') userId: number,
    @Body('currPassword') currPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.profile.updatePassword(userId, currPassword, newPassword);
  }

  @Post('email')
  addEmail(
    @GetUser('userEntityId') userId: number,
    @Body('email') dataEmail: AddEmailDto,
  ) {
    return this.profile.addEmail(userId, dataEmail);
  }
}

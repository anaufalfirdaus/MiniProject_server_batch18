import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';
import { ProfileService } from '../Services/profile.service';

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
}

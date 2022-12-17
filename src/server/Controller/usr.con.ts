import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../../entities/Users';
import { GetUser } from '../Auth/decorator';
import { UsersService } from '../Services/usr.srv';

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  roles: string;
  userPhoto: string;
}

@Controller()
export class UserController {
  constructor(private authService: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  public async signup(@Body() fields: any) {
    return this.authService.signup(fields);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@GetUser() user: Users): Promise<UserProfile> {
    return {
      userId: user.userEntityId,
      username: user.userName,
      email: user.usersEmail[0].pmailAddress,
      roles: user.usersRoles[0].usroRole.roleName,
      userPhoto: user.userPhoto,
    };
  }

  // TODO: update ------
  @Patch('profileupdate')
  async profileUpdate(@Body() fields: any) {
    return this.authService.updateProfile(fields);
  }

  @Patch('passwordupdate')
  async passwordUpdate(@Body() fields: any) {
    return await this.authService.updatePassword(fields);
  }

  @Patch('uploadphoto')
  async uploadPhoto(@Body() fields: any) {
    return await this.authService.updateProfileImage(
      Number(fields.id),
      fields.imageUrl,
    );
  }
}

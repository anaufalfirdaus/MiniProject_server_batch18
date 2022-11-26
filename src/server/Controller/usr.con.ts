import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../Services/usr.srv';

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
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('profileuser/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getProfile(id);
  }

  // TODO: Update Profile
  @Post('profileupdate/:userId')
  async profileUpdate(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    return this.authService.updateProfile(userId, fields);
  }

  // TODO: update password
  @Post('passwordupdate/:userId')
  async passwordUpdate(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    // return { userId, fields };
    return await this.authService.updatePassword(userId, fields);
  }

  // * EMAILS
  @Get('getemails/:userId')
  async getEmails(@Param('userId', ParseIntPipe) userId: number) {
    return this.authService.getEmails(userId);
  }

  @Post('addemail/:id')
  async addEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body('email') email: any,
  ) {
    return this.authService.addEmail(id, email);
  }

  @Get('removeemail/:id')
  async removeEmail(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.removeEmail(id);
  }
  // TODO: the phones table not an Array ✅
  @Post('addphone/:id')
  async addPhone(@Param('id', ParseIntPipe) id: number, @Body() field: any) {
    return this.authService.addPhone(id, field);
  }

  @Post('removephone')
  async removePhone(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('phoneId', ParseIntPipe) phoneId: number,
  ) {
    return await this.authService.removePhone(userId, phoneId);
  }

  // TODO:
  @Post('addaddress/:userId')
  async addAddress(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    return this.authService.addAddress(userId, fields);
  }

  @Post('addeducation/:userId')
  async addEducation(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    return this.authService.addEducation(userId, fields);
  }

  @Post('addexperience/:userId')
  async addExperience(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    return this.authService.addExperience(userId, fields);
  }

  @Post('addskill/:userId')
  async addSkill(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() fields: any,
  ) {
    return this.authService.addSkill(userId, fields);
  }
}

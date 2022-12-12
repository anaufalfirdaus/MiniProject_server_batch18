import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
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

  @Get('getphone/:id')
  async getEmail(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getPhone(id);
  }

  // TODO: Add ------
  @Post('addemail')
  async addEmail(@Body() fields: any) {
    return this.authService.addEmail(fields);
  }

  @Post('addphone')
  async addPhone(@Body() fields: any) {
    return this.authService.addPhone(fields);
  }

  @Post('addaddress')
  async addAddress(@Body() fields: any) {
    return this.authService.addAddress(fields);
  }

  @Post('addeducation')
  async addEducation(@Body() fields: any) {
    return this.authService.addEducation(fields);
  }

  @Post('addexperience')
  async addExperience(@Body() fields: any) {
    return this.authService.addExperience(fields);
  }

  @Post('addskill')
  async addSkill(@Body() fields: any) {
    return this.authService.addSkill(fields);
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

  @Patch('updateemail')
  async updateEmail(@Body() fields: any) {
    return this.authService.updateEmail(fields);
  }

  @Patch('updatephone')
  async updatePhone(@Body() fields: any) {
    return this.authService.updatePhone(fields);
  }

  @Patch('updateaddress')
  async updateAddress(@Body() fields: any) {
    return this.authService.updateAddress(fields);
  }

  @Patch('updateeducation')
  async updateEducation(@Body() fields: any) {
    return this.authService.updateEducation(fields);
  }

  @Patch('updateexperience')
  async updateExperience(@Body() fields: any) {
    return this.authService.updateExperience(fields);
  }

  //TODO: Delete/Remove ------
  @Delete('removeemail/:emailId')
  async removeEmail(@Param('emailId', ParseIntPipe) emailId: number) {
    return await this.authService.removeEmail(emailId);
  }

  @Delete('removephone/:phoneId')
  async removePhone(@Param('phoneId', ParseIntPipe) phoneId: number) {
    return await this.authService.removePhone(phoneId);
  }

  @Delete('removeaddress/:addressId')
  async removeAddress(@Param('addressId', ParseIntPipe) addressId: number) {
    return await this.authService.removeAddress(addressId);
  }

  @Delete('removeEducation/:educationId')
  async removeEducation(
    @Param('educationId', ParseIntPipe) educationId: number,
  ) {
    return this.authService.removeEducation(educationId);
  }

  @Delete('removeExperience/:expId')
  async removeExperience(@Param('expId', ParseIntPipe) expId: number) {
    return this.authService.removeExperience(expId);
  }

  @Delete('removeskill/:skillId')
  async removeSkill(@Param('skillId', ParseIntPipe) skillId: number) {
    return this.authService.removeSkill(skillId);
  }
}

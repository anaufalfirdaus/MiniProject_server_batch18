import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';
import { ProfileService } from '../Services/profile.service';
import {
  AddAddressDto,
  AddEducationDto,
  AddEmailDto,
  AddExperienceDto,
  AddPhoneDto,
  AddSkillDto,
  UpdateAddressDto,
  UpdateEducationDto,
  UpdateEmailDto,
  UpdateExperienceDto,
  UpdatePhoneDto,
  UpdateUserDto,
} from './profile/dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @Get('fetch')
  getProfile(@GetUser('userEntityId') userId: number) {
    return this.profile.getProfile(userId);
  }

  @Patch('user')
  updateUser(
    @GetUser('userEntityId') userId: number,
    @Body() userUpdate: UpdateUserDto,
  ) {
    return this.profile.updateUser(userId, userUpdate);
  }

  @Patch('setting/password')
  updatePassword(
    @GetUser('userEntityId') userId: number,
    @Body('currPassword') currPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.profile.updatePassword(userId, currPassword, newPassword);
  }

  @Post('setting/email')
  addEmail(
    @GetUser('userEntityId') userId: number,
    @Body() dataEmail: AddEmailDto,
  ) {
    return this.profile.addEmail(userId, dataEmail);
  }

  @Post('setting/phone')
  addPhone(
    @GetUser('userEntityId') userId: number,
    @Body() dataPhone: AddPhoneDto,
  ) {
    return this.profile.addPhone(userId, dataPhone);
  }

  @Post('setting/address')
  addAddress(
    @GetUser('userEntityId') userId: number,
    @Body() dataAddress: AddAddressDto,
  ) {
    return this.profile.addAddressUserAddress(userId, dataAddress);
  }

  @Post('setting/education')
  addEducation(
    @GetUser('userEntityId') userId: number,
    @Body() dataEducation: AddEducationDto,
  ) {
    return this.profile.addEducation(userId, dataEducation);
  }

  @Post('setting/experience')
  addExperience(
    @GetUser('userEntityId') userId: number,
    @Body() dataExperience: AddExperienceDto,
  ) {
    return this.profile.addExperience(userId, dataExperience);
  }

  @Post('setting/skill')
  addSkill(
    @GetUser('userEntityId') userId: number,
    @Body() dataSkill: AddSkillDto,
  ) {
    return this.profile.addSkill(userId, dataSkill);
  }

  @Patch('setting/email')
  updateEmail(
    @GetUser('userEntityId') userId: number,
    @Body() updateEmail: UpdateEmailDto,
  ) {
    return this.profile.updateEmail(userId, updateEmail);
  }

  @Patch('setting/phone')
  updatePhone(
    @GetUser('userEntityId') userId: number,
    @Body() updatePhone: UpdatePhoneDto,
  ) {
    return this.profile.updatePhone(userId, updatePhone);
  }

  @Patch('setting/address')
  updateAddress(
    @GetUser('userEntityId') userId: number,
    @Body() updateAddress: UpdateAddressDto,
  ) {
    return this.profile.updateUserAddress(userId, updateAddress);
  }

  @Patch('setting/education')
  updateEducation(
    @GetUser('userEntityId') userId: number,
    @Body() updateEducation: UpdateEducationDto,
  ) {
    return this.profile.updateEducation(userId, updateEducation);
  }

  @Patch('setting/experience')
  updateExperience(
    @GetUser('userEntityId') userId: number,
    @Body() updateExperience: UpdateExperienceDto,
  ) {
    return this.profile.updateExperience(userId, updateExperience);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/email/:id')
  removeEmail(
    @GetUser('userEntityId') userId: number,
    @Param('id') emailId: number,
  ) {
    return this.profile.removeEmail(userId, emailId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/phone/:id')
  removePhone(
    @GetUser('userEntityId') userId: number,
    @Param('id') phoneId: number,
  ) {
    return this.profile.removePhone(userId, phoneId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/address/:id')
  removeAddress(
    @GetUser('userEntityId') userId: number,
    @Param('id') addressId: number,
  ) {
    return this.profile.removeAddress(userId, addressId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/education/:id')
  removeEducation(
    @GetUser('userEntityId') userId: number,
    @Param('id') educationId: number,
  ) {
    return this.profile.removeEducation(userId, educationId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/experience/:id')
  removeExperience(
    @GetUser('userEntityId') userId: number,
    @Param('id') expId: number,
  ) {
    return this.profile.removeExperience(userId, expId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('setting/skill/:id')
  removeSkill(
    @GetUser('userEntityId') userId: number,
    @Param('id') skillId: number,
  ) {
    return this.profile.removeSkill(userId, skillId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
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

  @Delete('setting/email')
  removeEmail(
    @GetUser('userEntityId') userId: number,
    @Body() emailId: number,
  ) {
    return this.profile.removeEmail(userId, emailId);
  }

  @Delete('setting/phone')
  removePhone(
    @GetUser('userEntityId') userId: number,
    @Body() phoneId: number,
  ) {
    return this.profile.removePhone(userId, phoneId);
  }

  @Delete('setting/address')
  removeAddress(
    @GetUser('userEntityId') userId: number,
    @Body() addressId: number,
  ) {
    return this.profile.removeAddress(userId, addressId);
  }

  @Delete('setting/education')
  removeEducation(
    @GetUser('userEntityId') userId: number,
    educationId: number,
  ) {
    return this.profile.removeEducation(userId, educationId);
  }

  @Delete('setting/experience')
  removeExperience(
    @GetUser('userEntityId') userId: number,
    @Body() expId: number,
  ) {
    return this.profile.removeExperience(userId, expId);
  }

  @Delete('setting/skill')
  removeSkill(
    @GetUser('userEntityId') userId: number,
    @Body() skillId: number,
  ) {
    return this.profile.removeSkill(userId, skillId);
  }
}

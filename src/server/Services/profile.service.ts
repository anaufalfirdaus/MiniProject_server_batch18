import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../../entities/Users';
import { Repository } from 'typeorm';
import {
  Address,
  AddressType,
  City,
  JobType,
  SkillType,
  Status,
  UsersAddress,
  UsersEducation,
  UsersEmail,
  UsersExperiences,
  UsersPhones,
  UsersSkill,
} from '../../entities';
import {
  AddEmailDto,
  AddPhoneDto,
  AddAddressDto,
  AddEducationDto,
  AddExperienceDto,
  AddSkillDto,
  UpdateEmailDto,
  UpdatePhoneDto,
  UpdateAddressDto,
  UpdateEducationDto,
  UpdateExperienceDto,
} from '../Controller/profile/dto';

const saltOrRounds = 10;
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Address) private address: Repository<Address>,
    @InjectRepository(AddressType) private addressType: Repository<AddressType>,
    @InjectRepository(Users) private user: Repository<Users>,
    @InjectRepository(City) private city: Repository<City>,
    @InjectRepository(JobType) private jobType: Repository<JobType>,
    @InjectRepository(SkillType) private skillType: Repository<SkillType>,
    @InjectRepository(Status) private status: Repository<Status>,
    @InjectRepository(UsersEmail) private userEmail: Repository<UsersEmail>,
    @InjectRepository(UsersPhones) private userPhone: Repository<UsersPhones>,
    @InjectRepository(UsersAddress)
    private userAddress: Repository<UsersAddress>,
    @InjectRepository(UsersEducation)
    private userEducation: Repository<UsersEducation>,
    @InjectRepository(UsersExperiences)
    private userExperience: Repository<UsersExperiences>,
    @InjectRepository(UsersSkill)
    private userSkill: Repository<UsersSkill>,
  ) {}

  async getProfile(userId: number) {
    try {
      const user = await this.user.findOne({
        where: { userEntityId: userId },
        relations: {
          //* Roles
          usersRoles: {
            usroRole: true,
          },
          //* Emails
          usersEmail: true,
          //* Phones
          usersPhones: true,
          //* Address
          usersAddresses: {
            etadAddr: { addrCity: true },
            etadAdty: true,
          },
          //* Education
          usersEducations: true,
          //* Experience
          usersExperiences: true,
          //* Skill
          usersSkills: {
            uskiSktyName: true,
          },
        },
      });
      delete user.userPassword;

      const listAddresses = await this.address.find();
      const addressType = await this.addressType.find();
      const city = await this.city.find();
      const jobType = await this.jobType.find();
      const skillType = await this.skillType.find();
      const statusType = await this.status.find();

      return {
        ...user,
        defaultEmail: user.usersEmail[0].pmailAddress,
        defaultRole: user.usersRoles[0].usroRole.roleName,
        defaultPhone: user.usersPhones[0].uspoPhone,
        listAddresses,
        addressType,
        city,
        jobType,
        skillType,
        statusType,
      };
    } catch (error) {
      throw new Error('Something went wrong, please try again later.');
    }
  }

  async updateUser(userId: number, userUpdate: Partial<Users>) {
    try {
      const user = await this.user.findOne({
        where: { userEntityId: userId },
      });
      Object.assign(user, userUpdate);
      const userUpdated = await this.user.save(user);
      delete user.userPassword;
      return userUpdated;
    } catch (error) {
      throw new Error('Something went wrong, please try again later');
    }
  }

  async updatePassword(
    userId: number,
    currPassword: string,
    newPassword: string,
  ): Promise<Users> {
    try {
      // find user
      const user = await this.user.findOne({
        where: { userEntityId: userId },
      });
      // chech if user exist
      if (!user) {
        throw new UnauthorizedException('Credentials Wrong');
      }
      // check if current password is match
      const isMatch = await bcrypt.compare(currPassword, user.userPassword);
      if (!isMatch) {
        throw new UnauthorizedException('Credentials Wrong');
      }
      // make new hash password
      const newHash = await bcrypt.hash(newPassword, saltOrRounds);
      // update hash password on user Object
      user.userPassword = newHash;
      // save & return saved user
      const updatedUser = await this.user.save(user);
      delete updatedUser.userPassword;
      return updatedUser;
    } catch (error) {
      throw new Error('Something went wrong, please try again later');
    }
  }

  async addEmail(userId: number, dataEmail: AddEmailDto): Promise<UsersEmail> {
    try {
      const newEmailEntity = this.userEmail.create({
        pmailEntityId: userId,
        pmailAddress: dataEmail.email,
        pmailModifiedDate: new Date(Date.now()).toISOString(),
      });
      const newEmail = await this.userEmail.save(newEmailEntity);
      return await this.getEmailById(userId, newEmail.pmailId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async addPhone(userId: number, dataPhone: AddPhoneDto): Promise<UsersPhones> {
    try {
      const newPhoneEntity = this.userPhone.create({
        uspoEntity: { userEntityId: userId },
        uspoPhone: dataPhone.phone,
        uspoPontyCode: { pontyCode: dataPhone.phoneCode },
        uspoModifiedDate: new Date(Date.now()).toISOString(),
      });

      const newPhone = await this.userPhone.save(newPhoneEntity);
      return await this.getPhoneById(userId, newPhone.uspoPhoneId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async addAddress(dataAddress: AddAddressDto): Promise<Address> {
    try {
      const newAddressEntity = this.address.create({
        addrLine1: dataAddress.addressLine1,
        addrLine2: dataAddress.addressLine2,
        addrPostalCode: dataAddress.postalCode,
        addrCity: { cityId: dataAddress.cityId },
        addrModifiedDate: new Date(Date.now()).toISOString(),
      });

      const newAddress = await this.address.save(newAddressEntity);
      return newAddress;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went Wrong, please try again later',
      );
    }
  }

  async addUserAddress(
    userId: number,
    addressId: number,
    addressTypeId: number,
  ): Promise<UsersAddress> {
    try {
      const newUserAddressEntity = this.userAddress.create({
        etadEntity: { userEntityId: userId },
        etadAddr: { addrId: addressId },
        etadAdty: { adtyId: addressTypeId },
        etadModifiedDate: new Date(Date.now()).toISOString(),
      });
      const newUserAddress = await this.userAddress.save(newUserAddressEntity);
      return await this.getAddressById(userId, newUserAddress.etadAddrId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Semething went wrong, please try again later',
      );
    }
  }

  async addAddressUserAddress(
    userId: number,
    dataAddress: AddAddressDto,
  ): Promise<UsersAddress> {
    try {
      const addressExist = await this.address.findOne({
        where: [
          { addrLine1: dataAddress.addressLine1 },
          { addrLine2: dataAddress.addressLine2 },
          { addrPostalCode: dataAddress.postalCode },
        ],
      });

      if (!addressExist) {
        const newAddress = await this.addAddress(dataAddress);
        return await this.addUserAddress(
          userId,
          newAddress.addrId,
          dataAddress.addressType,
        );
      }

      return await this.addUserAddress(
        userId,
        addressExist.addrId,
        dataAddress.addressType,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async addEducation(
    userId: number,
    dataEducation: AddEducationDto,
  ): Promise<UsersEducation> {
    try {
      const newUserEducationEntity = this.userEducation.create({
        usduEntityId: userId,
        usduSchool: dataEducation.school,
        usduDegree: dataEducation.degree,
        usduFieldStudy: dataEducation.fieldStudy,
        usduGrade: dataEducation.grade,
        usduStartDate: new Date(dataEducation.startDate).toISOString(),
        usduEndDate: new Date(dataEducation.endDate).toISOString(),
        usduActivities: dataEducation.activities,
        usduDescription: dataEducation.desc,
        usduModifiedDate: new Date(Date.now()).toISOString(),
      });
      const newUserEducation = await this.userEducation.save(
        newUserEducationEntity,
      );
      return newUserEducation;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async addExperience(
    userId: number,
    dataExp: AddExperienceDto,
  ): Promise<UsersExperiences> {
    try {
      const newUserExperienceEntity = this.userExperience.create({
        usexEntity: { userEntityId: userId },
        usexTitle: dataExp.title,
        usexProfileHeadline: dataExp.profileHeadline,
        usexEmploymentType: dataExp.employmentType,
        usexCompanyName: dataExp.companyName,
        usexIsCurrent: dataExp.isCurrent,
        usexStartDate: new Date(dataExp.startDate).toISOString(),
        usexEndDate: new Date(dataExp.endDate).toISOString(),
        usexIndustry: dataExp.industry,
        usexDescription: dataExp.desc,
        usexExperienceType: dataExp.experienceType,
        usexCity: { cityId: dataExp.cityId },
      });
      const newUserExperience = await this.userExperience.save(
        newUserExperienceEntity,
      );
      return await this.getExpById(userId, newUserExperience.usexId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async addSkill(userId: number, dataSkill: AddSkillDto): Promise<UsersSkill> {
    try {
      const newSkillEntity = this.userSkill.create({
        uskiEntity: { userEntityId: userId },
        uskiSktyName: { sktyName: dataSkill.skillName },
        uskiModifiedDate: new Date(Date.now()).toISOString(),
      });
      const newSkill = await this.userSkill.save(newSkillEntity);
      return await this.getSkillById(userId, newSkill.uskiId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async updateEmail(
    userId: number,
    updateEmail: UpdateEmailDto,
  ): Promise<UsersEmail> {
    try {
      const updateEmailEntity = await this.getEmailById(
        userId,
        updateEmail.emailId,
      );

      updateEmailEntity.pmailAddress = updateEmail.email;
      updateEmailEntity.pmailModifiedDate = new Date(Date.now());
      const updatedEmail = await this.userEmail.save(updateEmailEntity);
      return await this.getEmailById(userId, updatedEmail.pmailId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async updatePhone(
    userId: number,
    updatePhone: UpdatePhoneDto,
  ): Promise<UsersPhones> {
    try {
      const updatePhoneEntity = await this.getPhoneById(
        userId,
        updatePhone.phoneId,
      );
      updatePhoneEntity.uspoPhone = updatePhone.phone;
      updatePhoneEntity.uspoPontyCode.pontyCode = updatePhone.phoneCode;
      updatePhoneEntity.uspoModifiedDate = new Date(Date.now());
      return await this.userPhone.save(updatePhoneEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async updateUserAddress(
    userId: number,
    updateAddress: UpdateAddressDto,
  ): Promise<UsersAddress> {
    try {
      const addressExist = await this.address.find({
        where: [
          { addrLine1: updateAddress.addressLine1 },
          { addrLine2: updateAddress.addressLine2 },
          { addrPostalCode: updateAddress.postalCode },
        ],
      });

      if (!(addressExist.length > 0)) {
        console.log('addAddress');
        const newAddress = await this.addAddress(updateAddress);
        console.log('addUserAddress');
        return await this.addUserAddress(
          userId,
          newAddress.addrId,
          updateAddress.addressType,
        );
      }

      // delete the address that want to update
      console.log('remove');

      const removeAddressEntity = await this.getAddressById(
        userId,
        updateAddress.addressId,
      );

      const removeAddress = await this.userAddress.remove(removeAddressEntity);

      if (!removeAddress) {
        throw new InternalServerErrorException(
          'Something went wrong, please try again later.',
        );
      }
      console.log('removed');
      const newUserAddress = await this.addUserAddress(
        userId,
        addressExist[0].addrId,
        updateAddress.addressType,
      );
      return await this.getAddressById(userId, newUserAddress.etadAddrId);
    } catch (error) {
      console.log('hello');

      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async updateEducation(
    userId: number,
    updateEducation: UpdateEducationDto,
  ): Promise<UsersEducation> {
    try {
      // find education
      const updateEducationEntity = await this.userEducation.findOne({
        where: { usduEntityId: userId, usduId: updateEducation.educationId },
      });
      // preparing update data
      const update = {
        usduSchool: updateEducation.school,
        usduDegree: updateEducation.degree,
        usduFieldStudy: updateEducation.fieldStudy,
        usduGrade: updateEducation.grade,
        usduStartDate: new Date(updateEducation.startDate).toISOString(),
        usduEndDate: new Date(updateEducation.endDate).toISOString(),
        usduActivities: updateEducation.activities,
        usduDescription: updateEducation.desc,
        usduModifiedDate: new Date(Date.now()).toISOString(),
      };
      // update entity
      Object.assign(updateEducationEntity, update);
      // save & return data
      return await this.userEducation.save(updateEducationEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async updateExperience(
    userId: number,
    updateExperience: UpdateExperienceDto,
  ): Promise<UsersExperiences> {
    try {
      // get Experience Entity
      const updateExperienceEntity = await this.getExpById(
        userId,
        updateExperience.expId,
      );
      // preparing update data
      const update = {
        usexTitle: updateExperience.title,
        usexProfileHeadline: updateExperience.profileHeadline,
        usexEmploymentType: updateExperience.employmentType,
        usexCompanyName: updateExperience.companyName,
        usexIsCurrent: updateExperience.isCurrent,
        usexStartDate: new Date(updateExperience.startDate).toISOString(),
        usexEndDate: new Date(updateExperience.endDate).toISOString(),
        usexIndustry: updateExperience.industry,
        usexDescription: updateExperience.desc,
        usexExperienceType: updateExperience.experienceType,
        usexCity: { cityId: updateExperience.cityId },
      };
      // update data experience
      Object.assign(updateExperienceEntity, update);
      // save/update experience
      const updateExp = await this.userExperience.save(updateExperienceEntity);
      // return experience
      return await this.getExpById(userId, updateExp.usexId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removeEmail(userId: number, emailId: number): Promise<UsersEmail> {
    try {
      const removeEmailEntity = await this.getEmailById(userId, emailId);
      await this.userEmail.remove(removeEmailEntity);
      return removeEmailEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removePhone(userId: number, phoneId: number): Promise<UsersPhones> {
    try {
      const removePhoneEntity = await this.getPhoneById(userId, phoneId);
      return await this.userPhone.remove(removePhoneEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removeAddress(
    userId: number,
    addressId: number,
  ): Promise<UsersAddress> {
    try {
      const removeAddressEntity = await this.getAddressById(userId, addressId);
      return await this.userAddress.remove(removeAddressEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removeEducation(
    userId: number,
    educationId: number,
  ): Promise<UsersEducation> {
    try {
      const removeEduationEntity = await this.getEducationById(
        userId,
        educationId,
      );
      return await this.userEducation.remove(removeEduationEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removeExperience(
    userId: number,
    expId: number,
  ): Promise<UsersExperiences> {
    try {
      const removeExperienceEntity = await this.getExpById(userId, expId);
      return await this.userExperience.remove(removeExperienceEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async removeSkill(userId: number, skillId: number): Promise<UsersSkill> {
    try {
      const removeSkillEntity = await this.getSkillById(userId, skillId);
      return await this.userSkill.remove(removeSkillEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  // Helper function
  async getEmailById(userId: number, emailId: number): Promise<UsersEmail> {
    try {
      const email = await this.userEmail.findOne({
        where: { pmailEntityId: userId, pmailId: emailId },
      });
      if (!email) throw new NotFoundException('Email not found');

      return email;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async getPhoneById(userId: number, phoneId: number): Promise<UsersPhones> {
    try {
      const phone = await this.userPhone.findOne({
        where: { uspoEntity: { userEntityId: userId }, uspoPhoneId: phoneId },
        relations: {
          uspoPontyCode: true,
        },
      });

      if (!phone) throw new NotFoundException('Phone not found');

      return phone;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async getAddressById(
    userId: number,
    addressId: number,
  ): Promise<UsersAddress> {
    try {
      const address = await this.userAddress.findOne({
        where: {
          etadEntity: { userEntityId: userId },
          etadAddr: { addrId: addressId },
        },
        relations: {
          etadAddr: {
            addrCity: true,
          },
          etadAdty: true,
        },
      });

      if (!address) throw new NotFoundException('Address not found');

      return address;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async getEducationById(
    userId: number,
    educationId: number,
  ): Promise<UsersEducation> {
    try {
      const education = await this.userEducation.findOne({
        where: { usduEntityId: userId, usduId: educationId },
      });

      if (!education)
        throw new NotFoundException(
          'Education not found, please try again later.',
        );
      return education;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async getExpById(userId: number, expId: number): Promise<UsersExperiences> {
    try {
      const exp = await this.userExperience.findOne({
        where: { usexEntity: { userEntityId: userId }, usexId: expId },
        relations: {
          usexCity: true,
        },
      });

      if (!exp) throw new NotFoundException('Experience not found');
      return exp;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async getSkillById(userId: number, skillId: number): Promise<UsersSkill> {
    try {
      const skill = await this.userSkill.findOne({
        where: {
          uskiEntity: { userEntityId: userId },
          uskiId: skillId,
        },
        relations: {
          uskiSktyName: true,
        },
      });

      if (!skill)
        throw new NotFoundException('Skill not found, please try again later');
      return skill;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }
}

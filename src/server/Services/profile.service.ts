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
      return await this.user.save(user);
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

  async addAddress(
    userId: number,
    dataAddress: AddAddressDto,
  ): Promise<UsersAddress> {
    try {
      // chech if address exist
      const addressExist = await this.address.findOne({
        where: [
          { addrLine1: dataAddress.addressLine1 },
          { addrLine2: dataAddress.addressLine2 },
          { addrPostalCode: dataAddress.postalCode },
        ],
      });
      // if address exist add to user Address
      if (!addressExist) {
        const newAddressEntity = this.address.create({
          addrLine1: dataAddress.addressLine1,
          addrLine2: dataAddress.addressLine2,
          addrPostalCode: dataAddress.postalCode,
          addrCity: { cityId: dataAddress.cityId },
          addrModifiedDate: new Date(Date.now()).toISOString(),
        });

        const newAddress = await this.address.save(newAddressEntity);
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

  // Helper function
  async getEmailById(userId: number, emailId: number): Promise<UsersEmail> {
    try {
      return await this.userEmail.findOne({
        where: { pmailEntityId: userId, pmailId: emailId },
        select: {
          pmailId: true,
          pmailAddress: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Email not found');
    }
  }

  async getPhoneById(userId: number, phoneId: number): Promise<UsersPhones> {
    try {
      return await this.userPhone.findOne({
        where: { uspoEntity: { userEntityId: userId }, uspoPhoneId: phoneId },
        select: {
          uspoPhoneId: true,
          uspoPhone: true,
          uspoPontyCode: { pontyCode: true },
        },
      });
    } catch (error) {
      throw new NotFoundException('Phone not found');
    }
  }

  async getAddressById(
    userId: number,
    addressId: number,
  ): Promise<UsersAddress> {
    try {
      return await this.userAddress.findOne({
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
        select: {
          etadAddrId: true,
          etadAddr: {
            addrLine1: true,
            addrLine2: true,
            addrPostalCode: true,
            addrCity: { cityId: true, cityName: true },
          },
          etadAdty: { adtyId: true, adtyName: true },
        },
      });
    } catch (error) {
      throw new NotFoundException('Address not found, please try again');
    }
  }

  async getExpById(userId: number, expId: number): Promise<UsersExperiences> {
    try {
      return await this.userExperience.findOne({
        where: { usexEntity: { userEntityId: userId }, usexId: expId },
        relations: {
          usexCity: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Experience not found, please try again later',
      );
    }
  }

  async getSkillById(userId: number, skillId: number): Promise<UsersSkill> {
    try {
      return await this.userSkill.findOne({
        where: {
          uskiEntity: { userEntityId: userId },
          uskiId: skillId,
        },
        relations: {
          uskiSktyName: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Skill not found, please try again later');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../entities/Users';
import { Repository } from 'typeorm';
import { Entities } from '../../entities/Entities';
import { UsersPhones } from '../../entities/UsersPhones';
import { UsersEmail } from '../../entities/UsersEmail';
import { UsersRoles } from '../../entities/UsersRoles';
import { Address } from '../../entities/Address';
import { UsersAddress } from '../../entities/UsersAddress';
import { UsersEducation } from '../../entities/UsersEducation';
import { UsersExperiences } from '../../entities/UsersExperiences';
import { UsersSkill } from '../../entities/UsersSkill';
import { AddressType } from '../../entities/AddressType';
import { City } from '../../entities/City';
import { JobType } from '../../entities/JobType';
import { SkillType } from '../../entities/SkillType';
import { Status } from '../../entities/Status';

const saltOrRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AddressType)
    private addressTypeRepo: Repository<AddressType>,
    @InjectRepository(City) private cityRepo: Repository<City>,
    @InjectRepository(JobType) private jobTypeRepo: Repository<JobType>,
    @InjectRepository(SkillType) private skillTypeRepo: Repository<SkillType>,
    @InjectRepository(Status) private statusTypeRepo: Repository<Status>,
    @InjectRepository(Entities) private entity: Repository<Entities>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(UsersPhones) private usersPhone: Repository<UsersPhones>,
    @InjectRepository(UsersEmail) private usersEmail: Repository<UsersEmail>,
    @InjectRepository(UsersRoles) private usersRoles: Repository<UsersRoles>,
    @InjectRepository(UsersAddress)
    private userAddress: Repository<UsersAddress>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(UsersEducation)
    private educationRepository: Repository<UsersEducation>,
    @InjectRepository(UsersExperiences)
    private userExperience: Repository<UsersExperiences>,
    @InjectRepository(UsersSkill)
    private skillRepository: Repository<UsersSkill>,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, pass: string) {
    const user = await this.usersRepo.findOne({
      relations: {
        usersRoles: {
          usroRole: true,
        },
        usersEmail: true,
      },
      where: [{ userName: username }],
    });
    console.log(user);
    const compare = await Bcrypt.compare(pass, user.userPassword);
    if (compare) {
      const { userPassword, ...result } = user;
      return result;
    }
  }

  public async login(user: any) {
    console.log(user);
    const payload = {
      username: user.userName,
      sub: user.userEntityId,
      email: user.usersEmail ? user.usersEmail[0].pmailAddress : null,
      roles: user.usersRoles ? user.usersRoles[0].usroRole.roleName : null,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async signup(fields: any) {
    try {
      const newEntityId = this.entity.create({});
      const entityId = await this.entity.save(newEntityId);
      let hashpassword = fields.password;
      hashpassword = await Bcrypt.hash(hashpassword, saltOrRounds);

      const user = this.usersRepo.create({
        userEntityId: entityId.entityId,
        userFirstName: fields.userFirstName,
        userLastName: fields.userLastName,
        userName: fields.userName,
        userModifiedDate: new Date(),
        userPassword: hashpassword,
      });
      await this.usersRepo.save(user);

      const userEmail = this.usersEmail.create({
        pmailEntityId: entityId.entityId,
        pmailAddress: fields.pmailAddress,
        pmailModifiedDate: new Date(),
      });
      await this.usersEmail.save(userEmail);

      const userPhone = this.usersPhone.create({
        uspoPhoneId: 2,
        uspoPhone: fields.uspoNumber,
        uspoModifiedDate: new Date(Date.now()).toISOString(),
        uspoPontyCode: fields.uspoPontyCode,
      });
      await this.usersPhone.save(userPhone);

      const userRole = this.usersRoles.create({
        usroEntityId: entityId.entityId,
        usroRoleId: fields.usroRoleId,
        usroModifiedDate: new Date(),
      });
      await this.usersRoles.save(userRole);

      const { userPassword, ...rest } = user;
      return rest;
    } catch (error) {
      return error.message;
    }
  }

  public async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({
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
          etadAddr: true,
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
      where: [{ userEntityId: userId }],
    });
    // console.log(user);
    const { userPassword, ...rest } = user;
    const addressType = await this.addressTypeRepo.find();
    const city = await this.cityRepo.find();
    const jobType = await this.jobTypeRepo.find();
    const skillType = await this.skillTypeRepo.find();
    const statusType = await this.statusTypeRepo.find();

    return {
      ...rest,
      defaultEmail: user.usersEmail[0].pmailAddress,
      defaultRole: user.usersRoles[0].usroRole.roleName,
      defaultPhone: user.usersPhones[0].uspoPhone,
      addressType,
      city,
      jobType,
      skillType,
      statusType,
    };
  }

  //* Helper Function to get new Address
  public async getAddress(id: number) {
    return this.userAddress.findOne({
      relations: {
        etadAddr: true,
        etadAdty: true,
      },
      where: { etadAddrId: id },
    });
  }
  //* Helper Fuction to get new Skill
  public async getSkill(id: number) {
    return await this.skillRepository.findOne({
      relations: {
        uskiSktyName: true,
      },
      where: { uskiId: id },
    });
  }

  // TODO: Update Profile
  public async updateProfile(fields: any) {
    const user = await this.usersRepo.findOne({
      where: { userEntityId: fields.userId },
    });
    Object.assign(user, fields);
    const userUpdate = await this.usersRepo.save(user);
    const { userPassword, ...rest } = userUpdate;
    return rest;
  }

  // TODO: Update Password
  public async updatePassword(fields: any) {
    // * FIND USER
    const user = await this.usersRepo.findOne({
      where: { userEntityId: fields.userId },
    });
    // * VALIDATE CURRENT PASSWORD
    const compare = await Bcrypt.compare(
      fields.currentPassword,
      user.userPassword,
    );
    // * UPDATE PASSWORD (IF PASSWORD PASS VALIDATION)
    if (compare) {
      const hashpassword = await Bcrypt.hash(fields.userPassword, saltOrRounds);
      fields.userPassword = hashpassword;
      Object.assign(user, fields);
      await this.usersRepo.save(user);
      return {
        info: 'Success',
        message: 'Update Password Success',
      };
    }
    return {
      info: 'failed',
      message: 'current password not match, please try again',
    };
  }

  //TODO : ADD ---------
  public async addEmail(fields: any) {
    const newEmail = this.usersEmail.create({
      pmailEntityId: fields.userId,
      pmailAddress: fields.email,
      pmailModifiedDate: new Date(Date.now()).toISOString(),
    });

    return this.usersEmail.save(newEmail);
  }

  public async addPhone(fields: any) {
    const newPhone = this.usersPhone.create({
      uspoEntity: { userEntityId: fields.userId },
      uspoPhone: fields.phone,
      uspoModifiedDate: new Date(Date.now()).toISOString(),
      uspoPontyCode: { pontyCode: fields.code },
    });

    return await this.usersPhone.save(newPhone);
  }

  public async addAddress(dataAddress: any) {
    // * ADD new Address to table Address
    const newAddress = this.addressRepository.create({
      addrLine1: dataAddress.addressLine1,
      addrLine2: dataAddress.addressLine2,
      addrCity: { cityId: dataAddress.cityId },
      addrPostalCode: dataAddress.addressPostalCode,
      addrModifiedDate: new Date(Date.now()).toISOString(),
    });
    const address = await this.addressRepository.save(newAddress);
    // * Input new Address to table UserAddress
    const newuserAddress = this.userAddress.create({
      etadAddr: { addrId: address.addrId },
      etadEntity: { userEntityId: dataAddress.userId },
      etadAdty: { adtyId: dataAddress.addressType },
      etadModifiedDate: new Date(Date.now()).toISOString(),
    });
    // * Return new Address
    const newAdds = await this.userAddress.save(newuserAddress);
    return this.getAddress(newAdds.etadAddrId);
  }

  public async addEducation(dataEducation: any) {
    const newEducation = this.educationRepository.create({
      usduEntityId: dataEducation.userId,
      usduSchool: dataEducation.school,
      usduDegree: dataEducation.degree,
      usduFieldStudy: dataEducation.fieldStudy,
      usduStartDate: new Date(
        dataEducation.startYear,
        dataEducation.startMonth,
        1,
      ).toISOString(),
      usduEndDate: new Date(
        dataEducation.endYear,
        dataEducation.endMonth,
        1,
      ).toISOString(),
      usduGrade: dataEducation.grade,
      usduActivities: dataEducation.activities,
      usduDescription: dataEducation.description,
      usduModifiedDate: new Date(Date.now()).toISOString(),
    });
    return await this.educationRepository.save(newEducation);
  }

  public async addExperience(dataExp: any) {
    const newExp = this.userExperience.create({
      usexEntity: { userEntityId: dataExp.userId },
      usexTitle: dataExp.title,
      usexProfileHeadline: dataExp.profileHeadline,
      usexEmploymentType: dataExp.employeementType,
      usexCompanyName: dataExp.companyName,
      usexIsCurrent: dataExp.isCurrent,
      usexStartDate: new Date(
        dataExp.startYear,
        dataExp.startMonth,
        1,
      ).toISOString(),
      usexEndDate: new Date(dataExp.endYear, dataExp.endMonth, 1).toISOString(),
      usexIndustry: dataExp.industry,
      usexDescription: dataExp.description,
      usexExperienceType: dataExp.experienceType,
      usexCity: dataExp.city,
    });
    return await this.userExperience.save(newExp);
  }

  public async addSkill(dataSkill: any) {
    const newSkill = this.skillRepository.create({
      uskiEntity: { userEntityId: dataSkill.userId },
      uskiSktyName: dataSkill.skillName,
      uskiModifiedDate: new Date(Date.now()).toISOString(),
    });

    const newSkll = await this.skillRepository.save(newSkill);
    return await this.getSkill(newSkll.uskiId);
  }

  //TODO :REMOVE ----------------
  public async removeEmail(emailId: number) {
    const remEmail = await this.usersEmail.findOne({
      where: { pmailId: emailId },
    });
    if (remEmail) {
      return await this.usersEmail.remove(remEmail);
    }

    return {
      info: 'failed',
      message: 'Email not found, please try again later',
    };
  }

  public async removePhone(phoneId: number) {
    const remPhone = await this.usersPhone.findOne({
      where: { uspoPhoneId: phoneId },
    });

    if (remPhone) {
      return await this.usersPhone.remove(remPhone);
    }
    return {
      info: 'failed',
      message: 'number not found, please try again later',
    };
  }

  public async removeAddress(addressId: number) {
    const remAddress = await this.addressRepository.findOne({
      where: { addrId: addressId },
    });
    if (remAddress) {
      await this.addressRepository.remove(remAddress);
      return { etadAddrId: addressId };
    }

    return {
      info: 'failed',
      message: 'Address not found, please try again later',
    };
  }

  public async removeEducation(educationId: number) {
    const remEducation = await this.educationRepository.findOne({
      where: { usduId: educationId },
    });
    if (remEducation) {
      await this.educationRepository.remove(remEducation);
      return { usduId: educationId };
    }

    return {
      info: 'failed',
      message: 'Education not found, please try again later',
    };
  }

  public async removeExperience(expId: number) {
    const remExp = await this.userExperience.findOne({
      where: { usexId: expId },
    });

    if (remExp) {
      return await this.userExperience.remove(remExp);
    }

    return {
      info: 'failed',
      message: 'Experience not found, please try again later',
    };
  }

  public async removeSkill(skillId: number) {
    const remSkill = await this.skillRepository.findOne({
      where: { uskiId: skillId },
    });

    if (remSkill) {
      return await this.skillRepository.remove(remSkill);
    }

    return {
      info: 'failed',
      message: 'Skill not found, please try again later',
    };
  }
}

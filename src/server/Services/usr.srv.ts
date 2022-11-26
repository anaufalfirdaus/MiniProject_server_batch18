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
import { Roles } from '../../entities/Roles';
import { Address } from '../../entities/Address';
import { UsersAddress } from '../../entities/UsersAddress';
import { UsersEducation } from '../../entities/UsersEducation';
import { UsersExperiences } from '../../entities/UsersExperiences';
import { UsersSkill } from '../../entities/UsersSkill';

const saltOrRounds = 10;
@Injectable()
export class UsersService {
  constructor(
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
    // const user = await this.usersRepo
    //   .createQueryBuilder('Users')
    //   .select([
    //     'usersRole.usroRole AS roles',
    //     'usersEmail AS emails',
    //     'usersPhones AS phones',
    //     'usersAddresses AS address',
    //     'usersEducations AS educations',
    //     'usersExperiences AS experiences',
    //     'usersSkills AS skills',
    //   ])
    //   .where({ userEntityId: userId });

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
    return {
      ...rest,
      defaultEmail: user.usersEmail[0].pmailAddress,
      defaultRole: user.usersRoles[0].usroRole.roleName,
      defaultPhone: user.usersPhones[0].uspoPhone,
    };
  }

  // TODO: Update Profile
  public async updateProfile(userId: number, fields: any) {
    const user = await this.usersRepo.findOne({
      where: { userEntityId: userId },
    });
    Object.assign(user, fields);
    return await this.usersRepo.save(user);
  }

  // TODO: Update Password
  public async updatePassword(userId: number, fields: any) {
    // * FIND USER
    const user = await this.usersRepo.findOne({
      where: { userEntityId: userId },
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
      return await this.usersRepo.save(user);
    }
    return {
      info: 'failed',
      message: 'current password not match, please try again',
    };
  }

  // * EMAILS
  public async getEmails(userId: number) {
    return await this.usersEmail.find({ where: { pmailEntityId: userId } });
  }

  public async addEmail(userId: number, email: string) {
    const newEmail = this.usersEmail.create({
      pmailEntityId: userId,
      pmailAddress: email,
    });

    return this.usersEmail.save(newEmail);
  }

  public async removeEmail(emailId: number) {
    const remEmail = await this.usersEmail.findOne({
      where: { pmailId: emailId },
    });
    return await this.usersEmail.remove(remEmail);
  }

  // * PHONES
  public async addPhone(userId: number, fields: any) {
    const newPhone = this.usersPhone.create({
      uspoEntity: { userEntityId: userId },
      uspoPhone: fields.phone,
      uspoModifiedDate: new Date(Date.now()).toISOString(),
      uspoPontyCode: { pontyCode: fields.code },
    });

    return await this.usersPhone.save(newPhone);
  }

  public async removePhone(userId: number, phoneId: number) {
    const remPhone = await this.usersPhone.findOne({
      where: { uspoPhoneId: phoneId, uspoEntity: { userEntityId: userId } },
    });

    if (remPhone) {
      return await this.usersPhone.remove(remPhone);
    }
    return {
      info: 'failed',
      message: 'number not found, please try again later',
    };
  }

  // * ADDRESS
  public async getAddress(userId: number) {
    return await this.userAddress.find({
      where: { etadAddrId: userId },
    });
  }
  //TODO: ADD ADDRESS
  public async addAddress(userId: number, dataAddress: any) {
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
      etadEntity: { userEntityId: userId },
      etadAdty: { adtyId: dataAddress.addressType },
      etadModifiedDate: new Date(Date.now()).toISOString(),
    });
    // * Return new Address
    return await this.userAddress.save(newuserAddress);
  }
  // * EDUCATIONS
  //TODO: ADD EDUCATION
  public async addEducation(userId: number, dataEducation: any) {
    const newEducation = this.educationRepository.create({
      usduEntityId: userId,
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
  // * EXPERIENCES
  //TODO: Add Experience
  public async addExperience(userId: number, dataExp) {
    const newExp = this.userExperience.create({
      usexEntity: { userEntityId: userId },
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
  // * SKILLS
  //TODO: Add Skill
  public async addSkill(userId: number, dataSkill: any) {
    const newSkill = this.skillRepository.create({
      uskiEntity: { userEntityId: userId },
      uskiSktyName: dataSkill.skillName,
      uskiModifiedDate: new Date(Date.now()).toISOString(),
    });

    return await this.skillRepository.save(newSkill);
  }
}

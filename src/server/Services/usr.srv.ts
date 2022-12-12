import { ConflictException, Injectable } from '@nestjs/common';
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
      userPhoto: user.userPhoto,
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
      where: [{ userEntityId: userId }],
    });
    // console.log(user);
    const { userPassword, ...rest } = user;
    const addressType = await this.addressTypeRepo.find();
    const city = await this.cityRepo.find();
    const jobType = await this.jobTypeRepo.find();
    const skillType = await this.skillTypeRepo.find();
    const statusType = await this.statusTypeRepo.find();
    const listAddresses = await this.addressRepository.find();

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
      listAddresses,
    };
  }

  //* Helper Function to get new Address
  public async getAddress(id: number) {
    return this.userAddress.findOne({
      relations: {
        etadAddr: { addrCity: true },
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

  // TODO: upload photo
  public async updateProfileImage(id: number, imageUrl: string) {
    const user = await this.usersRepo.findOne({
      where: { userEntityId: id },
    });
    user.userPhoto = imageUrl;
    return await this.usersRepo.save(user);
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
    // * CHECK IF Address Exist
    const addressExist = await this.addressRepository.findOne({
      where: {
        addrLine1: dataAddress.addressLine1,
        addrLine2: dataAddress.addressLine2,
        addrPostalCode: dataAddress.addressPostalCode,
      },
    });
    // * IF Addres Exist just add to usersAddress table
    // * Check If address already exist on usersAddress Table
    // * If userAddress exist return with warning
    if (addressExist) {
      const userAddressExist = await this.userAddress.findOne({
        where: { etadAddrId: addressExist.addrId },
      });
      if (userAddressExist) {
        // * Sending 409 HTTP Code
        throw new ConflictException('Address already exist on users table');
      }
    }
    // * If Address exist just update the user Address table
    if (addressExist) {
      const newAddressUser = this.userAddress.create({
        etadAddr: { addrId: addressExist.addrId },
        etadEntity: { userEntityId: dataAddress.userId },
        etadAdty: { adtyId: dataAddress.addressType },
        etadModifiedDate: new Date(Date.now()).toISOString(),
      });
      const newAdds = await this.userAddress.save(newAddressUser);
      return this.getAddress(newAdds.etadAddrId);
    }
    //* If Address not exist
    //* Create new Address if not exist
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
    const remAddress = await this.userAddress.findOne({
      where: { etadAddrId: addressId },
    });
    if (remAddress) {
      await this.userAddress.remove(remAddress);
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
      await this.userExperience.remove(remExp);
      return { usexId: expId };
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
      await this.skillRepository.remove(remSkill);
      return { uskiId: skillId };
    }

    return {
      info: 'failed',
      message: 'Skill not found, please try again later',
    };
  }

  //TODO: UPDATE-------
  public async updateEmail(dataUpdate: any) {
    const email = await this.usersEmail.findOne({
      where: { pmailId: dataUpdate.emailId, pmailEntityId: dataUpdate.userId },
    });
    Object.assign(email, dataUpdate);
    return await this.usersEmail.save(email);
  }
  // * Helper Function
  public async getPhone(id: number) {
    const phone = await this.usersPhone.findOne({
      relations: {
        uspoPontyCode: true,
      },
      where: {
        uspoPhoneId: id,
      },
    });
    return phone;
  }

  public async updatePhone(dataUpdate: any) {
    const phone = await this.usersPhone.findOne({
      relations: {
        uspoPontyCode: true,
      },
      where: {
        uspoEntity: dataUpdate.uspoEntity,
        uspoPhoneId: dataUpdate.uspoPhoneId,
      },
    });
    Object.assign(phone, dataUpdate);
    phone.uspoPontyCode.pontyCode = dataUpdate.pontyCode;
    return await this.usersPhone.save(phone);
  }
  //TODO : Need to fix
  public async updateAddress(dataUpdate: any) {
    // if address not exist create new address
    const addressExist = await this.addressRepository.find({
      where: [
        { addrLine1: dataUpdate.addrLine1 },
        { addrLine2: dataUpdate.addrLine2 },
        { addrPostalCode: dataUpdate.addrPostalCode },
      ],
    });
    // if Address exist remove the old userAddress, then just add the new address to user
    if (addressExist.length > 0) {
      const remUserAddress = await this.userAddress.findOne({
        where: { etadAddrId: dataUpdate.addressId },
      });
      await this.userAddress.remove(remUserAddress);
      const newUserAddress = this.userAddress.create({
        etadAddr: { addrId: addressExist[0].addrId },
        etadEntity: { userEntityId: dataUpdate.userId },
        etadAdty: { adtyId: dataUpdate.addressType },
        etadModifiedDate: new Date(Date.now()).toISOString(),
      });
      await this.userAddress.save(newUserAddress);
      return await this.userAddress.find({
        where: { etadEntity: { userEntityId: dataUpdate.userId } },
        relations: {
          etadAddr: { addrCity: true },
          etadAdty: true,
        },
      });
    }
    // if address not exist, then create new Address
    const newAddress = this.addressRepository.create({
      addrLine1: dataUpdate.addrLine1,
      addrLine2: dataUpdate.addrLine2,
      addrCity: { cityId: dataUpdate.cityId },
      addrPostalCode: dataUpdate.addrPostalCode,
      addrModifiedDate: new Date(Date.now()).toISOString(),
    });
    const address = await this.addressRepository.save(newAddress);
    const remUserAddress = await this.userAddress.findOne({
      where: { etadAddrId: dataUpdate.addressId },
    });
    await this.userAddress.remove(remUserAddress);
    const newUserAddress = this.userAddress.create({
      etadAddr: { addrId: address.addrId },
      etadEntity: { userEntityId: dataUpdate.userId },
      etadAdty: { adtyId: dataUpdate.addressType },
      etadModifiedDate: new Date(Date.now()).toISOString(),
    });
    await this.userAddress.save(newUserAddress);
    return await this.userAddress.find({
      where: { etadEntity: { userEntityId: dataUpdate.userId } },
      relations: {
        etadAddr: { addrCity: true },
        etadAdty: true,
      },
    });
  }

  public async updateEducation(dataUpdate: any) {
    const education = await this.educationRepository.findOne({
      where: { usduId: dataUpdate.usduId },
    });
    const { startYear, startMonth, endMonth, endYear, ...updateRest } =
      dataUpdate;
    Object.assign(education, updateRest);
    education.usduStartDate = new Date(startYear, startMonth, 1);
    education.usduEndDate = new Date(endYear, endMonth, 1);
    return await this.educationRepository.save(education);
  }

  public async updateExperience(dataUpdate: any) {
    const exp = await this.userExperience.findOne({
      where: { usexId: dataUpdate.usexId },
    });
    const { startMonth, startYear, endMonth, endYear, ...restUpdate } =
      dataUpdate;
    Object.assign(exp, restUpdate);
    exp.usexStartDate = new Date(startYear, startMonth, 1);
    exp.usexEndDate = new Date(endYear, endMonth);
    return await this.userExperience.save(exp);
  }
}

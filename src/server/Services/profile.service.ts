import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users';
import { Repository } from 'typeorm';
import {
  Address,
  AddressType,
  City,
  JobType,
  SkillType,
  Status,
} from '../../entities';

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
}

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
import { UsersAddress } from '../../entities/UsersAddress';
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
      // const { userPassword, ...result } = user;
      delete user.userPassword;
      return user;
    }
  }

  public async login(user: {
    userName: string;
    userEntityId: number;
    usersEmail: [{ pmailAddress: string }];
    usersRoles: [{ usroRole: { roleName: string } }];
    userPhoto: string;
  }): Promise<{ access_token: string }> {
    const payload = {
      username: user.userName,
      sub: user.userEntityId,
      email: user.usersEmail[0].pmailAddress,
      roles: user.usersRoles[0].usroRole.roleName,
      userPhoto: user.userPhoto,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: 'secretKey',
    });
    return {
      access_token: token,
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
}

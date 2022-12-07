import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigMulter } from './Middleware/multer.conf';
import { UsersService } from './Services/usr.srv';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './Auth/local.strategy';
import { JwtStrategy } from './Auth/jwt.strategy';
import { UserController } from './Controller/usr.con';
import { Users } from '../entities/Users';
import { UsersEmail } from '../entities/UsersEmail';
import { UsersPhones } from '../entities/UsersPhones';
import { UsersRoles } from '../entities/UsersRoles';
import { Entities } from '../entities/Entities';
import { Roles } from '../entities/Roles';
import { Address } from '../entities/Address';
import { UsersAddress } from '../entities/UsersAddress';
import { UsersEducation } from '../entities/UsersEducation';
import { UsersExperiences } from '../entities/UsersExperiences';
import { UsersSkill } from '../entities/UsersSkill';
import { AddressType } from '../entities/AddressType';
import { City } from '../entities/City';
import { JobType } from '../entities/JobType';
import { SkillType } from '../entities/SkillType';
import { Status } from '../entities/Status';
import { CurriculumService } from './Services/curriculum.service';
import { CurriculumController } from './Controller/curriculum.controller';
import { ProgramEntity } from '../entities/ProgramEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      UsersAddress,
      UsersEducation,
      UsersExperiences,
      UsersSkill,
      Entities,
      Roles,
      Address,
      AddressType,
      City,
      JobType,
      SkillType,
      Status,
      ProgramEntity,
    ]),
    MulterModule.register(ConfigMulter.UploadFiles()),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [UsersService, CurriculumService, LocalStrategy, JwtStrategy],
  controllers: [UserController, CurriculumController],
  exports: [UsersService],
})
export class ServerModule {}

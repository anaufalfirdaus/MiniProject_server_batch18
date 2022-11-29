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
import { Client } from '../entities/Client';
import { ClientService } from './Services/client.srv';
import { ClientController } from './Controller/client.con';
import { EmployeeClientContract } from '../entities/EmployeeClientContract';
import { AlumniService } from './Services/alumni.srv';
import { AlumniController } from './Controller/alumni.con';
import { ProgramsReview } from '../entities/ProgramsReview';
import { ProgramEntity } from '../entities/ProgramEntity';
import { ProgramController } from './Controller/program.con';
import { ProgramService } from './Services/program.srv';
import { Batch } from '../entities/Batch';
import { BatchStudent } from '../entities/BatchStudent';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      Entities,
      Roles,
      Client,
      EmployeeClientContract,
      ProgramsReview,
      ProgramEntity,
      Batch,
      BatchStudent,
    ]),
    MulterModule.register(ConfigMulter.UploadFiles()),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [
    UsersService,
    LocalStrategy,
    JwtStrategy,
    ClientService,
    AlumniService,
    ProgramService,
  ],
  controllers: [
    UserController,
    ClientController,
    AlumniController,
    ProgramController,
  ],
  exports: [UsersService],
})
export class ServerModule {}

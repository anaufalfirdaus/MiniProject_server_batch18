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
import { JobType } from '../entities/JobType';
import { JobTypeService } from './Services/jobtype.srv';
import { JobTypeController } from './Controller/jobtype.con';
import { JobCategory } from '../entities/JobCategory';
import { JobCategoryService } from './Services/jobcategory.srv';
import { JobCategoryController } from './Controller/jobcategory.con';
import { JobRoleService } from './Services/jobrole.srv';
import { JobRoleController } from './Controller/jobrole.con';
import { JobRole } from '../entities/JobRole';
import { JobPostService } from './Services/jobpost.srv';
import { JobPostController } from './Controller/jobpost.con';
import { JobPost } from '../entities/JobPost';
import { Client } from '../entities/Client';
import { ClientService } from './Services/client.srv';
import { ClientController } from './Controller/client.con';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      Entities,
      Roles,
      JobType,
      JobCategory,
      JobRole,
      JobPost,
      Client,
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
    JobTypeService,
    JobCategoryService,
    JobRoleService,
    JobPostService,
    ClientService,
  ],
  controllers: [
    UserController,
    JobTypeController,
    JobCategoryController,
    JobRoleController,
    JobPostController,
    ClientController,
  ],
  exports: [UsersService],
})
export class ServerModule {}

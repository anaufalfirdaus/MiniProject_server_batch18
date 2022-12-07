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
import { CourseReview } from '../entities/CourseReview';
import { courseReviewService } from './Services/CourseReview.service';
import { courseReviewController } from './Controller/CourseReview.controller';
import { ProgramEntity } from '../entities/ProgramEntity';
import { programEntityService } from './Services/ProgramEntity.service';
import { programEntityController } from './Controller/ProgramEntity.controller';
import { usersService } from './Services/Users.service';
import { usersController } from './Controller/Users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      Entities,
      Roles,
      CourseReview,
      ProgramEntity,
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
    courseReviewService,
    programEntityService,
    usersService,
  ],
  controllers: [
    UserController,
    courseReviewController,
    programEntityController,
    usersController,
  ],
  exports: [UsersService],
})
export class ServerModule {}

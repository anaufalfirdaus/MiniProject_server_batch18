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
import { JobPost } from '../entities/JobPost';
import { JopoService } from './Services/jopo.srv';
import { JopoController } from './Controller/jopo.con';
import { TalentApply } from '../entities/TalentApply';
import { TaapService } from './Services/taap.srv';
import { TaapController } from './Controller/taap.con';
import { CourseReview } from '../entities/CourseReview';
import { CoreRevService } from './Services/coreRev.srv';
import { CoreRevController } from './Controller/coreRev.con';
import { UsersMedia } from '../entities/UsersMedia';
import { UsersEducation } from '../entities/UsersEducation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      UsersMedia,
      UsersEducation,
      Entities,
      JobPost,
      TalentApply,
      CourseReview,
      Roles,
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
    JopoService,
    TaapService,
    CoreRevService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [
    UserController,
    JopoController,
    TaapController,
    CoreRevController,
  ],
  exports: [UsersService],
})
export class ServerModule {}

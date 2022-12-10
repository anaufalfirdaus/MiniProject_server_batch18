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
import { Contents } from '../entities/Contents';
import { ContControll } from './Controller/cont.con';
import { ContentsServices } from './Services/cont.srv';
import { CourseReview } from '../entities/CourseReview';
import { CoreControll } from './Controller/core.con';
import { CoreServices } from './Services/core.srv';
import { Employee } from '../entities/Employee';
import { EmpControll } from './Controller/emp.con';
import { EmployeeService } from './Services/emp.srv';
import { SkillTemplate } from '../entities/SkillTemplate';
import { SkteControll } from './Controller/skte.con';
import { SkillTemplateServices } from './Services/skte.srv';
import { SkillType } from '../entities/SkillType';
import { SktyControll } from './Controller/skty.con';
import { SkillTypeServices } from './Services/skty.srv';
import { ProgramEntity } from '../entities/ProgramEntity';
import { ProgControll } from './Controller/prog.con';
import { ProgramEntitiesServices } from './Services/prog.srv';
import { CoursesServices } from './Services/corse.srv';
import { CorseControll } from './Controller/corse.con';
import { Courses } from '../entities/Courses';
import { InstructorCourse } from '../entities/InstructorCourse';
import { InstructorCoursesServices } from './Services/inco.srv';
import { IncoControll } from './Controller/inco.con';
import { ContentSectionMaterial } from '../entities/ContentSectionMaterial';
import { CosmControll } from './Controller/cosm.con';
import { CosmServices } from './Services/cosm.srv';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersEmail,
      UsersPhones,
      UsersRoles,
      Entities,
      Roles,
      Contents,
      CourseReview,
      Employee,
      SkillTemplate,
      SkillType,
      ProgramEntity,
      Courses,
      InstructorCourse,
      ContentSectionMaterial,
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
    ContentsServices,
    CoreServices,
    EmployeeService,
    SkillTemplateServices,
    SkillTypeServices,
    ProgramEntitiesServices,
    CoursesServices,
    InstructorCoursesServices,
    CosmServices,
  ],
  controllers: [
    UserController,
    ContControll,
    CoreControll,
    EmpControll,
    SkteControll,
    SktyControll,
    ProgControll,
    CorseControll,
    IncoControll,
    CosmControll,
  ],
  exports: [
    UsersService,
    ContentsServices,
    CoreServices,
    EmployeeService,
    SkillTemplateServices,
    SkillTypeServices,
    ProgramEntitiesServices,
    CoursesServices,
    InstructorCoursesServices,
    CosmServices,
  ],
})
export class ServerModule {}

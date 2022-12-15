import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectRepository(Users) private user: Repository<Users>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: any): Promise<Users> {
    const user = await this.user.findOne({
      where: { userEntityId: payload.sub },
      relations: {
        usersEmail: true,
        usersRoles: { usroRole: true },
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.userPassword;
    return user;

    // return {
    //   userId: payload.sub,
    //   username: payload.username,
    //   email: payload.email,
    //   roles: payload.roles,
    //   userPhoto: payload.userPhoto,
    // };
  }
}

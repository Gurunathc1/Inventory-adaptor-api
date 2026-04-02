import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Roles } from 'common/roles.enums';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.token, // <-- read JWT from cookie
      ]),
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
  }

  async validate(payload: any) {
    try {
      return {
        userId: payload.sub,
        name: payload.name,
        email: payload.email,
        roles: payload.roles || [payload.role] as Roles[],
      };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}

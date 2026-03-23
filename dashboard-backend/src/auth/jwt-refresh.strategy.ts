import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-here',
      passReqToCallback: true, // ✅ Importante para pegar o token do header
    });
  }

  async validate(
    req: Request,
    payload: {
      sub: string;
      email: string;
      role: string;
      companyId: string;
    },
  ) {
    const refreshToken = req
      .get('Authorization')
      ?.replace('Bearer ', '')
      .trim();

    return {
      userId: payload.sub,
      email: payload.email,
      companyId: payload.companyId,
      role: payload.role,
      refreshToken, 
    };
  }
}

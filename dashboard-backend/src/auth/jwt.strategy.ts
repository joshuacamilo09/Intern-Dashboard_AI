import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    console.log(`SECRET STATUS: ${secret ? 'LOADED' : 'UNDEFINED'}`);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_ACCESS_SECRET ||
        'uiejnvwievnwituv wituvnwtv394v239582h594v',
    });
  }

  async validate(payload: { sub: string; email: string; role: string, companyId: string }) {
    return {
      sub: payload.sub, 
      email: payload.email,
      role: payload.role,
      userId: payload.sub, 
      companyId: payload.companyId
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'dev-secret';
    super({
      jwtFromRequest: (req: any) => {
        if (!req) return null;
        // Prefer cookie-based auth
        if (req.cookies && req.cookies['access_token']) return req.cookies['access_token'];
        // Fallback to Authorization header if present
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, gymId: payload.gymId, role: payload.role };
  }
}

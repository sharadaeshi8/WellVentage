import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSchema } from '../users/schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GymSchema } from '../gyms/schemas/gym.schema';
import { PhoneVerificationService } from './phone-verification.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET')!;
        const expiresIn = config.get<string>('JWT_EXPIRATION') || '7d';
        return {
          secret,
          signOptions: { expiresIn },
        } as any;
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Gym', schema: GymSchema },
    ]),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, PhoneVerificationService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

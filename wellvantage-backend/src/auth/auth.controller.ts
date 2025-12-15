import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PhoneVerificationService } from './phone-verification.service';
import { SendCodeDto, VerifyCodeDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneService: PhoneVerificationService,
  ) {}

  // Initiate Google OAuth via GET so /auth/google works in the browser
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    try {
      const { accessToken, isNew } = await this.authService.validateOAuthLogin(
        req.user,
      );
      // Set secure httpOnly cookie so token isn't exposed in URL
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const base = process.env.FRONTEND_URL ?? 'http://localhost:3000';
      const path = isNew ? '/register' : '/leads';
      return res.redirect(`${base}${path}`);
    } catch (err: any) {
      // Log and surface the message for debugging during development
      // eslint-disable-next-line no-console
      console.error('[Google Callback Error]', err);
      return res
        .status(500)
        .json({ message: err?.message || 'Internal Server Error' });
    }
  }

  @Post('logout')
  logout(@Res() res: any) {
    res.clearCookie('access_token', { path: '/' });
    return res.status(200).json({ ok: true });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) return { user: null };

    const user = await this.authService.getMe(userId);
    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    };
  }

  // Phone verification using Twilio Verify + libphonenumber-js validation
  @Post('phone/send-code')
  async sendCode(@Body() body: SendCodeDto) {
    const { phone, country } = body;
    const res = await this.phoneService.sendCode(phone, country);
    return { ok: true, status: res.status };
  }

  @Post('phone/verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    const { phone, code, country } = body;
    const res = await this.phoneService.checkCode(phone, code, country);
    return { ok: res.valid, status: res.status };
  }
}

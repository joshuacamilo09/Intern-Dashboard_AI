import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { Throttle } from '@nestjs/throttler';
import { LoginDTO } from './authDTO/login';
import { RegisterDto } from './authDTO/register';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './Guards/AuthGuard';
import { GetCurrentCompanyId, GetCurrentUser } from './decorators/get.current.user';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { user, tokens } = await this.authService.register(dto);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    });
    return { user, access_token: tokens.access_token };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    });
    return { user, access_token: tokens.access_token };
  }

  @Post('refresh')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const rt = req.cookies?.refresh_token;
    if (!rt) {
      throw new Error('No refresh token found');
    }
    try {
      const payload = await this.authService['jwt'].verifyAsync(rt, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = payload.sub;
      const tokens = await this.authService.refreshToken(userId, rt);
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
      });
      return { access_token: tokens.access_token };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  @UseGuards(AuthGuard) // ✅ Guard APENAS nesta rota
  @Post('logout')
  async logout(
    @Req() req: express.Request,
    @GetCurrentUser() userid: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = (req as any).user;
    await this.authService.logout(user.userId);
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out' };
  }

  @UseGuards(AuthGuard) // ✅ Guard APENAS nesta rota
  @Get('me')
  me(@Req() req: express.Request) {
    return (req as any).user;
  }

  private msFromEnv(exp: string) {
    if (exp.endsWith('m')) return parseInt(exp.slice(0, -1)) * 60 * 1000;
    if (exp.endsWith('h')) return parseInt(exp.slice(0, -1)) * 60 * 60 * 1000;
    if (exp.endsWith('d'))
      return parseInt(exp.slice(0, -1)) * 24 * 60 * 60 * 1000;
    return 7 * 24 * 60 * 60 * 1000;
  }

  // ✅ Rotas públicas - SEM guard
  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }
}

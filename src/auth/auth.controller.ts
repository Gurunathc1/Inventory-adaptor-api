import { Controller, Post, Body, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('token', result.token, {
      httpOnly: true,           // Prevent JS access to cookie (XSS protection)
      secure: false,            // Set to true in production (HTTPS)
      sameSite: 'lax',          // Helps CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return {
      message: result.message,
      token: result.token,
      user: result.user,
    };
  }
}



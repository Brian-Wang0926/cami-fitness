import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// @Controller 裝飾器定義這是一個控制器，'auth' 是路由前綴
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // 設置 HTTP 狀態碼為 200
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`收到註冊請求 - Email: ${registerDto}`);
    return this.authService.register(registerDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      const user = await this.authService.validateGoogleUser({
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.googleId,
      });
      const token = await this.authService.generateJwtToken(user);
      const state = req.query.state || '';

      this.logger.log('googleAuthCallback', user, token, state);

      const frontendUrl = this.configService.get('FRONTEND_URL');
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.append('token', token);
      redirectUrl.searchParams.append('auth', 'google');
      redirectUrl.searchParams.append(
        'userData',
        JSON.stringify({
          user_id: user.user_id,
          email: user.email,
          name: user.name,
        }),
      );
      redirectUrl.searchParams.append('state', state);
      redirectUrl.searchParams.append('toast', 'google_login_success');

      this.logger.log('googleAuthCallback', redirectUrl);

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      // 錯誤處理
      this.logger.error('Google callback error:', error);
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/login?error=google_auth_failed`,
      );
    }
  }
}

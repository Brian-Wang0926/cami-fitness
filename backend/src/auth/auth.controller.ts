import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// @Controller 裝飾器定義這是一個控制器，'auth' 是路由前綴
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // 設置 HTTP 狀態碼為 200
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

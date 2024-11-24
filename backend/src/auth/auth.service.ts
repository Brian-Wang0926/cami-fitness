import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable() // 裝飾器定義這是一個可注入的服務
export class AuthService {
  constructor(
    @InjectRepository(User) // 注入 User 實體的 Repository
    private userRepository: Repository<User>, //private 讓這個屬性或方法只能在類別內部使用
    private jwtService: JwtService, // 注入 JWT 服務
  ) {}

  async login(loginDto: LoginDto) {
    // 1. 查找用戶
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. 驗證密碼
    // bcrypt.compare 用於比較明文密碼和加密後的密碼
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. 生成 JWT token
    const payload = { email: user.email, sub: user.id };

    // 4. 返回 token 和用戶信息
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}

import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable() // 裝飾器定義這是一個可注入的服務
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) // 注入 User 實體的 Repository
    private userRepository: Repository<User>, //private 讓這個屬性或方法只能在類別內部使用
    private jwtService: JwtService, // 注入 JWT 服務
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log({
      type: 'LOGIN_ATTEMPT',
      email: loginDto.email,
    });

    try {
      // 1. 查找用戶
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      // 2. 如果用戶不存在，拋出特定錯誤
      if (!user) {
        this.logger.warn(`登入失敗 - 用戶不存在: ${loginDto.email}`);
        throw new UnauthorizedException('USER_NOT_FOUND');
      }

      // 3. 驗證密碼
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        this.logger.warn(`登入失敗 - 密碼錯誤: ${loginDto.email}`);
        throw new UnauthorizedException('密碼錯誤');
      }

      // 4. 更新最後登入時間
      await this.userRepository.update(user.user_id, {
        last_login: new Date(),
      });

      this.logger.log({
        type: 'LOGIN_SUCCESS',
        email: loginDto.email,
        userId: user.user_id,
      });

      // 5. 返回 token 和用戶信息
      return {
        access_token: this.jwtService.sign({
          email: user.email,
          sub: user.user_id,
        }),
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error({
        type: 'LOGIN_FAILED',
        email: loginDto.email,
        error: error.message,
      });
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    this.logger.log({
      type: 'REGISTER_ATTEMPT',
      email: registerDto.email,
    });

    try {
      // 檢查email是否已存在
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('該email已被註冊');
      }

      // 密碼加密
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);

      // 創建新用戶
      const user = this.userRepository.create({
        email: registerDto.email,
        password_hash: hashedPassword,
        name: registerDto.name,
        gender: registerDto.gender,
        birth: registerDto.birth,
      });

      // 儲存用戶
      await this.userRepository.save(user);

      this.logger.log({
        type: 'REGISTER_SUCCESS',
        email: registerDto.email,
        userId: user.user_id,
      });

      // 返回結果（不包含密碼）
      return {
        message: '註冊成功',
        user: {
          email: user.email,
          name: user.name,
          gender: user.gender,
          birth: user.birth,
        },
      };
    } catch (error) {
      this.logger.error({
        type: 'REGISTER_FAILED',
        email: registerDto.email,
        error: error.message,
      });
      throw error;
    }
  }

  async generateJwtToken(user: any) {
    return this.jwtService.sign({
      email: user.email,
      sub: user.user_id,
    });
  }

  async validateGoogleUser({
    email,
    name,
    googleId,
  }: {
    email: string;
    name: string;
    googleId: string;
  }) {
    try {
      this.logger.debug('Validating Google user:', { email, name, googleId });

      let user = await this.userRepository.findOne({
        where: [{ email }, { google_id: googleId }],
      });

      if (!user) {
        // 創建新用戶
        user = this.userRepository.create({
          email,
          name,
          google_id: googleId,
          // 其他必要欄位
        });

        await this.userRepository.save(user);
        this.logger.debug('Created new user from Google login:', user);
      } else {
        // 更新現有用戶的 Google ID（如果需要）
        if (!user.google_id) {
          user.google_id = googleId;
          await this.userRepository.save(user);
          this.logger.debug('Updated existing user with Google ID:', user);
        }
      }

      return user;
    } catch (error) {
      this.logger.error('Error in validateGoogleUser:', error);
      throw error;
    }
  }
}

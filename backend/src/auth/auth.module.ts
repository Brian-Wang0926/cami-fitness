import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

// @Module 裝飾器用於定義一個模組
@Module({
  imports: [
    // 註冊 User 實體到 TypeORM
    TypeOrmModule.forFeature([User]),
    // 設定 JWT 模組
    JwtModule.registerAsync({
      // 注入 ConfigService，可以讀取環境變數
      inject: [ConfigService],
      // 使用工廠函數來動態配置 JWT 模組
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            // 設定 JWT 的過期時間
            expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
          },
        };
      },
    }),
    PassportModule.register({
      session: true, // 啟用 session
      defaultStrategy: 'google',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}

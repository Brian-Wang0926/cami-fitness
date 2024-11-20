// JWT 策略定義了如何驗證 token
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 設定從 HTTP Header 的 Bearer token 中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 是否忽略過期的 token
      ignoreExpiration: false,
      // 使用環境變數中的 JWT 密鑰
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // 當 token 被驗證後，這個方法會被調用
  // payload 是解密後的 JWT 內容
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

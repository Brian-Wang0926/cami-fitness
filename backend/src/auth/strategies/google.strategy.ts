import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      state: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      // 調試輸出完整的 profile 對象
      this.logger.debug(
        'Full Google profile:',
        JSON.stringify(profile, null, 2),
      );

      // 檢查 profile 是否存在
      if (!profile) {
        throw new Error('No profile received from Google');
      }

      // 從 profile 中正確提取 email
      if (!profile.emails || profile.emails.length === 0) {
        this.logger.error('Profile emails array is empty or undefined');
        throw new Error('No email found in Google profile');
      }

      const email = profile.emails[0].value;
      const name =
        profile.displayName ||
        `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();

      // 調試輸出提取的資料
      this.logger.debug('Extracted user data:', {
        email,
        name,
        googleId: profile.id,
        provider: profile.provider,
      });

      // 驗證提取的資料
      if (!email || !name) {
        throw new Error(
          `Invalid Google profile data: email=${email}, name=${name}`,
        );
      }

      // 返回用戶資料
      return this.authService.validateGoogleUser({
        email,
        name,
        googleId: profile.id,
      });
    } catch (error) {
      this.logger.error('Google validation error:', error);
      this.logger.error('Profile that caused error:', profile);
      throw error;
    }
  }
}

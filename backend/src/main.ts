import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

async function bootstrap() {
  // 創建應用實例
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 設定全局 logger
  });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // 全局配置
  app.setGlobalPrefix('api'); // API 前綴
  // CORS 設定 - 允許跨域請求
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 全局管道
  app.useGlobalPipes(
    // ValidationPipe - 請求資料驗證
    new ValidationPipe({
      whitelist: true, // 過濾未定義的屬性
      transform: true, // 自動轉換類型
      forbidNonWhitelisted: true, // 禁止未定義的屬性
      enableDebugMessages: true, // 啟用詳細錯誤訊息
      exceptionFactory: (errors) => {
        const logger = new Logger('Validation');
        logger.debug('請求數據:', errors[0]?.target);
        logger.debug('驗證錯誤:', errors);
        return new BadRequestException({
          message: '驗證錯誤',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      },
    }),
  );

  // 設定 session 中間件
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'), // 使用環境變數存儲
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 24 小時
        secure: process.env.NODE_ENV === 'production', // 生產環境使用 HTTPS
      },
    }),
  );

  // 啟動服務
  const port = configService.get('PORT', 3001);
  await app.listen(port);

  // 日誌輸出
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Database: ${configService.get('database.database')}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();

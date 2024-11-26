import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // 請求開始時記錄
    this.logger.log(
      `[開始] ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    if (method !== 'GET') {
      this.logger.debug(`請求體: ${JSON.stringify(request.body)}`);
    }

    // 響應結束時記錄
    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - startTime;

      this.logger.log(
        `[結束] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
      );
    });

    next();
  }
}

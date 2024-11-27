import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const startTime = Date.now();

    // 記錄請求
    if (method !== 'GET') {
      this.logger.log({
        type: 'REQUEST',
        method,
        url: originalUrl,
        ip,
        body: request.body,
        query: request.query,
      });
    }

    // 記錄響應
    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - startTime;

      this.logger.log({
        type: 'RESPONSE',
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
      });
    });

    next();
  }
}

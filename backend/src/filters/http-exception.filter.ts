import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // 獲取更詳細的錯誤信息
    const errorDetails = {
      type: 'API_ERROR',
      path: request.url,
      method: request.method,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      body: request.body,
      query: request.query,
      params: request.params,
      user: request.user,
      errors: typeof errorResponse === 'object' ? errorResponse : undefined,
    };

    // 根據狀態碼使用不同的日誌級別
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('Server Error:', errorDetails);
      if (exception.stack) {
        this.logger.error('Stack Trace:', exception.stack);
      }
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn('Client Error:', errorDetails);
    } else {
      this.logger.log('Info:', errorDetails);
    }

    // 向客戶端返回適當的錯誤響應
    response.status(status).json({
      statusCode: status,
      timestamp: errorDetails.timestamp,
      path: errorDetails.path,
      message: this.getClientMessage(exception),
      errors: this.getClientErrors(errorResponse),
    });
  }

  private getClientMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'object' && 'message' in response) {
      const message = (response as { message: string | string[] }).message;
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return exception.message;
  }

  private getClientErrors(errorResponse: string | object): object | undefined {
    if (typeof errorResponse === 'object' && 'errors' in errorResponse) {
      return (errorResponse as { errors: object }).errors;
    }
    return undefined;
  }
}

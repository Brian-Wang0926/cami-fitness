import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';

describe('Auth System', () => {
  let app;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 過濾未在 DTO 中定義的屬性
        transform: true, // 自動轉換數據類型
        forbidNonWhitelisted: true, // 當存在未定義的屬性時拋出錯誤
      }),
    );
    await app.init();
  });

  // 測試登入功能
  describe('Authentication', () => {
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'testuser@gmail.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
        });
    });

    it('should fail with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'testuser@gmail.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with missing email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400); // 驗證管道會返回 400
    });

    it('should fail with missing password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'testuser@gmail.com',
        })
        .expect(400);
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistentuser@gmail.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

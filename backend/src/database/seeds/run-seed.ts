import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { createTestUser } from './create-test-user.seed';
import { DataSource } from 'typeorm';

async function runSeed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await createTestUser(dataSource);
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

runSeed();

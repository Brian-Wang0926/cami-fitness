import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { createTestUser } from './create-test-user.seed';
import { createDefaultExercises } from './create-default-exercises.seed';
import { createDefaultSessionExercises } from './create-default-session-exercises.seed';
import { DataSource } from 'typeorm';

async function runSeed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await createTestUser(dataSource);
    await createDefaultExercises(dataSource);
    await createDefaultSessionExercises(dataSource);
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

runSeed();

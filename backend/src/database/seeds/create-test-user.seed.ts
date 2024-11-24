import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export const createTestUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // 檢查測試用戶是否已存在
  const existingUser = await userRepository.findOne({
    where: { email: 'testuser@gmail.com' },
  });

  if (!existingUser) {
    // 創建新用戶
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = userRepository.create({
      email: 'testuser@gmail.com',
      password: hashedPassword,
    });

    await userRepository.save(user);
    console.log('Test user created successfully');
  } else {
    console.log('Test user already exists');
  }
};

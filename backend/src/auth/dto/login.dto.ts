// DTO (Data Transfer Object) 用於定義數據的格式和驗證規則
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString() // 驗證必須是字串
  @IsNotEmpty() // 驗證不能為空
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

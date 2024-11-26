// 定義通用參數類型
export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  gender?: string;
  birth?: Date;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

// 自動登入結果
export interface AutoLoginResult {
  success: boolean;
  error?: Error | unknown;
}

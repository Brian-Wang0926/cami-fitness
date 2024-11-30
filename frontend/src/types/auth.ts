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
  id?: number; // 一般登入用
  user_id?: string; // Google 登入用
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

export interface LoginFormValues {
  email: string;
  password: string;
  showPassword: boolean;
}

export interface GoogleLoginResponse {
  token: string;
  userData: User;
}

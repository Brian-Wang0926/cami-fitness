import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { storage } from "@/lib/storage";
import type {
  AutoLoginResult,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  User,
} from "@/types/auth";

export function useAuth() {
  // 取得 React Query 的客戶端實例，用於管理快取
  const queryClient = useQueryClient();

  // useMutation：用於處理數據修改操作（POST, PUT, DELETE 等）
  // 登入 mutation
  const loginMutation = useMutation({
    // mutationFn：定義實際的 API 調用
    mutationFn: (credentials: LoginCredentials) =>
      api.post<LoginResponse, LoginCredentials>("/api/auth/login", credentials),
    // onSuccess：成功後的回調
    onSuccess: (data) => {
      // 儲存 token 和使用者資料到 localStorage
      storage.set("token", data.access_token);
      storage.set("user", JSON.stringify(data.user));
      // 更新 React Query 快取中的使用者資料
      queryClient.setQueryData(["user"], data.user);
    },
  });

  // 註冊 mutation
  const registerMutation = useMutation({
    mutationFn: async (
      credentials: RegisterCredentials
    ): Promise<AutoLoginResult> => {
      // 先執行註冊
      await api.post<RegisterResponse>("/api/auth/register", credentials);
      
      // 註冊成功後嘗試自動登入
      try {
        await loginMutation.mutateAsync({
          email: credentials.email,
          password: credentials.password,
        });
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
  });

  // 使用 useQuery 來管理用戶狀態
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () => {
      const userData = storage.get("user");
      return userData ? JSON.parse(userData) : null;
    },
    staleTime: Infinity, // 資料永不過期
  });

  // 登出函數
  const logout = () => {
    // 清除 localStorage 中的資料
    storage.remove("token");
    storage.remove("user");
    // 清除快取中的使用者資料
    queryClient.setQueryData(["user"], null);
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    user,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isLoadingUser,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    userError,
  };
}

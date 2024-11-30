import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { storage } from "@/lib/storage";
import type {
  AutoLoginResult,
  GoogleLoginResponse,
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
    mutationFn: async (credentials: LoginCredentials) =>
      api.post<LoginResponse, LoginCredentials>("/api/auth/login", credentials),
    // onSuccess：成功後的回調
    onSuccess: (data) => {
      // 儲存 token 和使用者資料到 localStorage
      storage.setToken(data.access_token);
      storage.setUser(data.user);
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

  // Google 登入 mutation
  const googleLoginMutation = useMutation({
    mutationFn: async ({ token, userData }: GoogleLoginResponse) => {
      try {
        // 驗證 state 參數
        const storedState = sessionStorage.getItem("googleAuthState");
        const urlState = new URLSearchParams(window.location.search).get(
          "state"
        );

        // 添加調試日誌
        console.log("Stored state:", storedState);
        console.log("URL state:", urlState);
        console.log("Full URL:", window.location.href);

        // 如果 state 參數丟失，可以選擇跳過驗證
        if (storedState && urlState && storedState !== urlState) {
          throw new Error("Invalid authentication state");
        }

        await storage.setToken(token);
        await storage.setUser(userData);
        queryClient.setQueryData(["user"], userData);

        // 清理 state
        sessionStorage.removeItem("googleAuthState");

        return { token, user: userData };
      } catch (error) {
        console.error("Google login error:", error);
        throw error;
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
      const userData = storage.getUser();
      return userData;
    },
    staleTime: Infinity, // 資料永不過期
  });

  // 登出函數
  const logout = () => {
    // 清除 localStorage 中的資料
    storage.clear();

    // 清除快取中的使用者資料
    queryClient.setQueryData(["user"], null);
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  // 處理 Google 登入的函數
  const loginWithGoogle = (token: string, userData: string) => {
    try {
      const parsedUserData = JSON.parse(userData);
      googleLoginMutation.mutate(
        {
          token,
          userData: parsedUserData,
        },
        {
          onSuccess: () => {
            console.log("Google login successful");
          },
          onError: (error) => {
            console.error("Google login failed:", error);
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  };

  return {
    login: loginMutation.mutate,
    loginWithGoogle,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    user,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      isLoadingUser ||
      googleLoginMutation.isPending,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    userError,
  };
}

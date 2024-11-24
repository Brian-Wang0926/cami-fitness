import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { storage } from "@/lib/storage";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  // useMutation：用於處理數據修改操作（POST, PUT, DELETE 等）
  const loginMutation = useMutation({
    // mutationFn：定義實際的 API 調用
    mutationFn: (credentials: LoginCredentials) =>
      api.post<LoginResponse, LoginCredentials>("/api/auth/login", credentials),
    // onSuccess：成功後的回調
    onSuccess: (data) => {
      storage.set("token", data.access_token);
      storage.set("user", JSON.stringify(data.user));
      // 更新快取中的用戶資料
      queryClient.setQueryData(["user"], data.user);
    },
  });

  // 使用 useQuery 來管理用戶狀態
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const userData = storage.get("user");
      return userData ? JSON.parse(userData) : null;
    },
    // 不自動重新獲取
    staleTime: Infinity,
  });

  return {
    login: loginMutation.mutate,
    logout: () => {
      storage.remove("token");
      storage.remove("user");
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    user,
    isLoading: loginMutation.isPending || isLoadingUser,
    error: loginMutation.error,
  };
}

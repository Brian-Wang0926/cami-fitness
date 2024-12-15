"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { storage } from "@/lib/storage";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !user) {
        // 儲存當前路徑
        const currentPath = window.location.pathname;
        // 清除認證資訊
        await storage.clear();
        // 重定向到登入頁面，並帶上原始路徑
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();
  }, [user, isLoading, router]);

  // 檢查 token 是否過期
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = storage.getToken();
      if (!token) return;

      try {
        // 解析 JWT
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) return;

        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; // 轉換為毫秒
        const currentTime = Date.now();

        // 如果 token 過期
        if (currentTime > expirationTime) {
          storage.clear();
          router.push("/login?error=session_expired");
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    // 初次檢查
    checkTokenExpiration();

    // 定期檢查 token 狀態（每分鐘）
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

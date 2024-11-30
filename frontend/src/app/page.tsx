"use client";

import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    const auth = searchParams.get("auth");
    const userData = searchParams.get("userData");
    const toastType = searchParams.get("toast");

    if (token && auth === "google" && userData) {
      loginWithGoogle(token, userData);

      // 處理 Google 登入成功的 toast
      if (toastType === "google_login_success") {
        showToast({
          type: "success",
          message: "Google 登入成功！",
        });
      }
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, router, loginWithGoogle, showToast]);

  // 在登入頁面也添加錯誤 toast 處理
  useEffect(() => {
    const toastType = searchParams.get("toast");
    if (toastType === "google_login_error") {
      showToast({
        type: "error",
        message: "Google 登入失敗，請稍後再試",
      });
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams, showToast]);

  // 處理未登入重定向
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">歡迎來到 Cami Fitness</h1>
        <p className="text-xl">歡迎回來，{user?.name}！</p>
      </div>
    </AuthGuard>
  );
}

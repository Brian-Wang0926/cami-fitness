"use client";

import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">歡迎來到 Cami Fitness</h1>
        <p className="text-xl">歡迎回來，{user?.email}！</p>
      </div>
    </AuthGuard>
  );
}

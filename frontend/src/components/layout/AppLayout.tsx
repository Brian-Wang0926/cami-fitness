"use client";

import MainLayout from "./MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { usePathname } from "next/navigation";

const publicPaths = ["/login", "/register"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 公開路徑不需要 MainLayout 和 AuthGuard
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // 其他路徑需要 AuthGuard 保護
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

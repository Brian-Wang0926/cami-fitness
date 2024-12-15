import Providers from "./providers";
import { ErrorSuppress } from "@/components/ErrorSuppress";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <ErrorSuppress />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "关于 APPDO | 数字生活指南",
  description: "APPDO 数字生活指南：专注于 App 评测、数字工具推荐与实用教程。",
  metadataBase: new URL("https://appdo.xyz"),
  openGraph: {
    title: "关于 APPDO | 数字生活指南",
    description: "发现更好用的 App、工具与服务，打造更高效、更安全的数字生活。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}

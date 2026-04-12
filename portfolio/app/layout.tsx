import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "./ContentProvider";

export const metadata: Metadata = {
  title: "个人技术主页 | 项目、系统与工程实践",
  description: "涵盖项目实践、界面系统、视觉表达、工具链与技术验证的个人技术主页。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}

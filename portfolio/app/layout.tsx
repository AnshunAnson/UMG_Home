import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "./ContentProvider";

export const metadata: Metadata = {
  title: "技术美术主页 | 实时视觉、材质与工具流程",
  description: "聚焦实时视觉、材质系统、特效制作、渲染流程与技术工具链的个人技术美术主页。",
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

import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "./ContentProvider";

export const metadata: Metadata = {
  title: "Portfolio | Creative Developer",
  description: "A futuristic cyberpunk portfolio showcasing creative development",
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

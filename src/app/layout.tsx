import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "demo-nextjs — my-harness-flow 示例",
  description: "Next.js + my-harness-flow 任务管理器示例",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

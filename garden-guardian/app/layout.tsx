import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "我的作品集｜Selected Works", template: "%s｜我的作品集" },
  description: "四个精选作品的项目展示与案例入口。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

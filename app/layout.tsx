import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "水澄Mizu｜个人主页",
  description: "水澄Mizu的个人主页——将创意落地，收录个人项目、网站与联系方式。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mizusumi.com"),
  title: "水澄Mizu的个人主页",
  description: "水澄Mizu的个人主页——将创意落地，收录个人项目、网站与联系方式。",
  icons: {
    icon: "/mizu-avatar.jpg",
    apple: "/mizu-avatar.jpg",
  },
  openGraph: {
    title: "水澄Mizu的个人主页",
    description: "将创意落地。浏览我的网站、项目与实验。",
    url: "https://mizusumi.com",
    siteName: "水澄Mizu的个人主页",
    locale: "zh_CN",
    type: "website",
  },
  twitter: { card: "summary", title: "水澄Mizu的个人主页", description: "将创意落地。" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

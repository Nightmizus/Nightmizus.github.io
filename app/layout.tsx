import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nightmizus.github.io"),
  title: "水澄Mizu｜个人主页",
  description: "水澄Mizu的个人主页——将创意落地，收录个人项目、网站与联系方式。",
  openGraph: {
    title: "水澄Mizu｜个人主页",
    description: "将创意落地。浏览我的网站、项目与实验。",
    url: "https://nightmizus.github.io",
    siteName: "水澄Mizu的个人主页",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/og.png", width: 1728, height: 920, alt: "水澄Mizu的个人主页" }],
  },
  twitter: { card: "summary_large_image", title: "水澄Mizu｜个人主页", description: "将创意落地。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

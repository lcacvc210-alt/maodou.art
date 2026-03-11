import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "毛豆的思考空间 | Maodou's Art & Tech",
  description: "记录自媒体创业、财经思考与 AI 探索之旅",
  keywords: ["财经博主", "科技前沿", "AI 创业", "自媒体", "毛豆"],
  authors: [{ name: "毛豆", url: "https://maodou.art" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <footer className="py-8 text-center text-sm text-text-secondary border-t border-border">
            <p>© 2026 毛豆的思考空间 | maodou.art</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Noto_Sans_JP } from "next/font/google";

import { Metadata } from "next";
import React from "react";

import Header from "@/components/global/header";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/providers/NextAuth";

import "@/styles/globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex flex-col min-h-screen">
              <Header />
              <div className="container flex h-full py-6">
                <main className="flex-1">{children}</main>
              </div>
              <footer className="top-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">footer</div>
              </footer>
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

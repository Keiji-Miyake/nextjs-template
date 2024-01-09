import { Noto_Sans_JP } from "next/font/google";

import { Metadata } from "next";
import React from "react";

import { ErrorToaster } from "@/components/global/error-toast";
import Header from "@/components/global/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import NextAuthProvider from "@/providers/NextAuth";

import "@/styles/globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
                <Toaster />
                <ErrorToaster />
              </div>
              <footer className="top-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">footer</div>
              </footer>
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

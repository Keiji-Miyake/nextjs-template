import React from "react";

import { Metadata } from "next";

import Header from "@/components/global/header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="container flex h-full py-6">
        <div className="w-1/5">SideBar</div>
        <main className="w-4/5">{children}</main>
      </div>
      <footer className="top-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">footer</div>
      </footer>
    </div>
  );
}

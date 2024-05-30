// src/app/(private)/layout.tsx
import React from "react";

import { Metadata } from "next";

import Header from "@/components/global/header";
import Sidebar from "@/components/global/side-bar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}

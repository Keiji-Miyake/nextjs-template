import { Inter } from "next/font/google";

import { Metadata } from "next";

import UserProfile from "@/components/UserProfile";

export const metadata: Metadata = {
  title: "My Page Title",
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${inter.className} mb-3 text-2xl font-semibold`}>トップページ</h1>
      <UserProfile />
    </main>
  );
}

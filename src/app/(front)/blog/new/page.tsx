import { Inter } from "next/font/google";

import { Metadata } from "next";

import { Editor } from "@/components/editor";

export const metadata: Metadata = {
  title: "ブログ新規投稿",
  description: "ブログの新規投稿ページです。",
};

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  // const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${inter.className} mb-3 text-2xl font-semibold`}>ブログ新規投稿</h1>
      <div className="relative w-[800px] h-[600px] border-2 border-gray-300 bg-white text-gray-900">
        <Editor />
      </div>
    </main>
  );
}

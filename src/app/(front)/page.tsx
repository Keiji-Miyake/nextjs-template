import { Inter } from "next/font/google";

import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import UserProfile from "@/components/user-profile";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My Page Title",
  description: "My page description",
};

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const session = await auth();
  console.debug(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${inter.className} mb-3 text-2xl font-semibold`}>トップページ🚀</h1>
      <Button>Click here</Button>
      <UserProfile />
    </main>
  );
}

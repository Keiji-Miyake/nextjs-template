import { Inter } from "next/font/google";

import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { getServerSession } from "@/libs/auth";

export const metadata: Metadata = {
  title: "My Page Title",
  description: "My page description",
};

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const session = await getServerSession();
  console.debug(session);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className={`${inter.className} text-lg md:text-2xl font-semibold`}>トップページ🚀</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
          <p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
          <Button className="mt-4">Add Product</Button>
        </div>
      </div>
    </main>
  );
}

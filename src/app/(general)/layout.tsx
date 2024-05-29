import { Metadata } from "next";

import { ErrorToaster } from "@/components/global/error-toast";
import Header from "@/components/global/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}

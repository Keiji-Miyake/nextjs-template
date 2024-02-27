"use client"; // Error components must be Client Components

import { useEffect } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("エラーページ：", error);
  }, [error]);

  return (
    <div>
      <h2 className="text-2xl">{error.message}</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        やり直す
      </Button>
      <Button asChild>
        <Link href="/">HOMEに戻る</Link>
      </Button>
    </div>
  );
}

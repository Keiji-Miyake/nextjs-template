"use client"; // Error components must be Client Components

import Link from "next/link";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AppError } from "@/domains/error/class/AppError";

export default function Error({ error, reset }: { error: AppError & { digest?: string }; reset: () => void }) {
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

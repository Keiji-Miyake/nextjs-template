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
      <h2 className="text-2xl">{error.code}</h2>
      <p>{error.message}</p>
      {error.redirect ? (
        <Button asChild>
          <Link href={error.redirect}>戻る</Link>
        </Button>
      ) : (
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          やり直す
        </Button>
      )}
    </div>
  );
}

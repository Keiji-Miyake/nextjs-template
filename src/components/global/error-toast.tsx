"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { ErrorDictionary } from "@/config/error";

export const ErrorToaster = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (errorCode && errorCode in ErrorDictionary) {
      const errorMessage = ErrorDictionary[errorCode].message || "エラーが発生しました";
      toast({
        variant: "destructive",
        description: errorMessage,
      });

      // URLからエラーコードを削除
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.delete("error_code");
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    }
  }, [errorCode, toast, router]);

  return null;
};

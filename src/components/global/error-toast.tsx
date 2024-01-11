"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import { HttpResponseData, THttpResponseCode } from "@/config/httpResponse";

export const ErrorToaster = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (errorCode && errorCode in HttpResponseData) {
      const errorMessage = HttpResponseData[errorCode as THttpResponseCode].message || "エラーが発生しました";
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

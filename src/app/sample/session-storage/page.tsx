"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const SessionStorage = () => {
  const router = useRouter();

  const onClick = () => {
    sessionStorage.setItem("message", "送信完了しました。");
    return router.push("/sample/session-storage/confirm");
  };
  return (
    <>
      <Button onClick={onClick}>送信</Button>
    </>
  );
};

export default SessionStorage;

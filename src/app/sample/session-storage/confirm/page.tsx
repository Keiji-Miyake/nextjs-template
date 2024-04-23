"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";

const Confirm = () => {
  // const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const message = sessionStorage.getItem("message");
    if (message) {
      setMessage(message);
      sessionStorage.removeItem("message");
      toast({
        description: message,
      });
    }
  }, [message, toast]);

  // if (!message) return router.push("/sample/session-storage");

  return <div className="text-4xl">{message}</div>;
};

export default Confirm;

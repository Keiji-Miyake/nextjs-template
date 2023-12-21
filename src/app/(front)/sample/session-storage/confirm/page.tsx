"use client";

import { useEffect, useState } from "react";

const Confirm = () => {
  // const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const message = sessionStorage.getItem("message");
    if (message) {
      setMessage(message);
      sessionStorage.removeItem("message");
    }
  }, [message]);

  // if (!message) return router.push("/sample/session-storage");

  return <div className="text-4xl">{message}</div>;
};

export default Confirm;

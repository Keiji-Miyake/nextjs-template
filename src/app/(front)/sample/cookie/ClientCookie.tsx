"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const ClientCookie = () => {
  const [isCookie, setIsCookie] = useState(false);
  const middlewareCookie = getCookie("middleware") || "";

  useEffect(() => {
    if (middlewareCookie) setIsCookie(true);
  }, [middlewareCookie]);

  return (
    <>
      <h2>Client Component Cookie</h2>
      <div>{isCookie ? `middlewareクッキー: ${middlewareCookie}` : "Cookieがセットされていません。"}</div>
    </>
  );
};

export default ClientCookie;

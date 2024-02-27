"use client";
import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
  children: ReactNode;
}

// App Routerに対応するNextAuth用のProviderを作成
const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;

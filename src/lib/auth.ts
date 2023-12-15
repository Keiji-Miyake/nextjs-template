import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

import { AppError } from "@/domains/error/class/AppError";
import MemberService from "@/domains/member/service";

import { prisma } from "./prisma";

import type { NextAuthOptions } from "next-auth/index";

// NextAuth.jsの設定ファイル
// Credentials Providerを使う
// sessionにはdatabaseを使う
export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      id: "root",
      name: "root",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
      ) {
        if (!credentials) {
          throw new AppError("UNAUTHORIZED", "認証情報がありません。");
        }
        const memberService = new MemberService();

        try {
          const user = await memberService.signIn(credentials);
          return {
            id: user.id,
            memberId: user.memberId,
            email: user.email,
            role: user.role,
          } as any;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          memberId: u.memberId,
          role: u.role,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          memberId: token.memberId,
          role: token.role,
        },
      };
    },
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  } else {
    throw new AppError("UNAUTHORIZED");
  }
};

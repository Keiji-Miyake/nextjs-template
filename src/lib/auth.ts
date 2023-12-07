import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

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
    signIn: "/signIn",
  },
  providers: [
    Credentials({
      id: "user",
      name: "User",
      type: "credentials",
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
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isValidPassword) {
            return {
              id: user.id.toString(),
              email: user.email,
              password: user.password,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          }
        }
        // 認証失敗
        return null;
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
    return new Response("Unauthorized", { status: 401 });
  }
};

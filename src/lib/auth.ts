import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "./prisma";

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
    // signIn: "/signin",
  },
  providers: [
    Credentials({
      id: "owner",
      name: "Owner",
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
        const owner = await prisma.owner.findUnique({
          where: { email: credentials.email },
        });

        if (owner) {
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            owner.password,
          );

          if (isValidPassword) {
            return {
              id: owner.id.toString(),
              email: owner.email,
              password: owner.password,
              createdAt: owner.createdAt,
              updatedAt: owner.updatedAt,
            };
          }
        }
        // 認証失敗
        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
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
  },
};

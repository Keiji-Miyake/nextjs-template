import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AppError } from "@/domains/error/class/AppError";
import MemberService from "@/domains/member/service";

import { prisma } from "./prisma";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";

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
          return null;
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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("redirect", url, baseUrl);
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
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
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return session;
  } else {
    throw new AppError("UNAUTHORIZED");
  }
};

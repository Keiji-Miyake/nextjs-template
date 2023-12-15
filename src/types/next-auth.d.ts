import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface token {
    accessToken?: string;
    user: {
      id: number;
      memberId: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface Session {
    accessToken?: string;
    user: {
      id: number;
      memberId: string;
      role: Role;
    } & DefaultSession["user"];
    error?: string;
  }
}

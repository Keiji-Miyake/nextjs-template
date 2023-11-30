import "next-auth";

declare module "next-auth" {
  interface token {
    accessToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface Session {
    accessToken?: string;
    user: {
      id: number;
    } & DefaultSession["user"];
    error?: string;
  }
}

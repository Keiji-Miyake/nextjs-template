import { notFound } from "next/navigation";

import { Metadata } from "next";

import { UnauthorizedError } from "@/domains/error/class/UnauthorizedError";
import UserService from "@/domains/user/service";
import { auth } from "@/libs/auth";

import EditForm from "./EditForm";

export const metadata: Metadata = {
  title: "プロフィール編集ページ",
  description: "プロフィールの編集ページです。",
};

const Page = async () => {
  const session = await auth();
  if (!session) throw new UnauthorizedError();
  const userService = new UserService();
  const profile = await userService.getProfile(session?.user?.id);
  if (!profile) notFound();

  return (
    <div className="container">
      <h1>会員プロフィール編集</h1>
      <EditForm profile={profile} />
    </div>
  );
};

export default Page;

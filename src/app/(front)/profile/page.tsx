import { Metadata } from "next";

import { NotFoundError } from "@/domains/error/class/NotFoundError";
import { UnauthorizedError } from "@/domains/error/class/UnauthorizedError";
import { auth } from "@/libs/auth";
import { getProfile } from "@/libs/utils";

import EditForm from "./EditForm";

export const metadata: Metadata = {
  title: "プロフィール編集ページ",
  description: "プロフィールの編集ページです。",
};

const Page = async () => {
  const session = await auth();
  if (!session) throw new UnauthorizedError();
  const profile = await getProfile(session?.user?.id);
  if (!profile) throw new NotFoundError();
  return (
    <div className="container">
      <h1>会員プロフィール編集</h1>
      <EditForm profile={profile} />
    </div>
  );
};

export default Page;

import { Metadata } from "next";

import { AppError } from "@/domains/error/class/AppError";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/utils";

import EditForm from "./EditForm";

export const metadata: Metadata = {
  title: "プロフィール編集ページ",
  description: "プロフィールの編集ページです。",
};

const Page = async () => {
  const session = await auth();
  if (!session) throw new AppError("UNAUTHORIZED", "ログインしてください。", "/signin");
  const profile = await getProfile(session?.user?.id);
  if (!profile) throw new AppError("INTERNAL_SERVER_ERROR", "プロフィールが見つかりません。", "/");
  return (
    <div className="container">
      <h1>会員プロフィール編集</h1>
      <EditForm profile={profile} />
    </div>
  );
};

export default Page;

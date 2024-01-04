import Link from "next/link";

import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { AppError } from "@/domains/error/class/AppError";
import UserService from "@/domains/user/service";
import { auth } from "@/lib/auth";

import UserList from "./UserList";

export const metadata: Metadata = {
  title: "ユーザー一覧ページ",
  description: "ユーザー一覧ページ",
};

const users = async () => {
  const userService = new UserService();
  const session = await auth();
  if (!session) {
    throw new AppError("UNAUTHORIZED", "ログインが必要です。", "/login");
  }
  const users = await userService.getMemberUsers(session?.user.memberId);

  return (
    <div className="container">
      <h1>ユーザー一覧</h1>
      <Button asChild>
        <Link href={`/member/user/create`}>ユーザー作成</Link>
      </Button>
      <UserList users={users ?? []} />
    </div>
  );
};

export default users;

import { Metadata } from "next";

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
    return new AppError("UNAUTHORIZED", "ログインが必要です。", "/login");
  }
  const users = await userService.getMemberUsers(session?.user.memberId);

  return (
    <div className="container">
      <h1>ユーザー一覧</h1>
      <UserList users={users ?? []} />
    </div>
  );
};

export default users;

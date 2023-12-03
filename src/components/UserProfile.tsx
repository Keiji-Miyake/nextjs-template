"use client";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h2>
        <Link href="/profile">ユーザープロファイル</Link>
      </h2>
      {!session ? (
        <div>
          <p>未ログイン</p>
          <p>
            <Link href="/signIn">ログイン</Link>
          </p>
          <p>
            <Link href="/signUp/useForm">新規登録</Link>
          </p>
        </div>
      ) : (
        <div>
          <p>ログイン済み</p>
          <p>
            <button onClick={() => signOut()}>ログアウト</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

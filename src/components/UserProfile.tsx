"use client";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h2>ユーザープロファイル</h2>
      {!session ? (
        <div>
          <p>未ログイン</p>
          <Link href="/signin">ログイン</Link>
        </div>
      ) : (
        <div>
          <p>ログイン済み</p>
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

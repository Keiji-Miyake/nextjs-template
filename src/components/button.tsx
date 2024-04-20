import { signIn, signOut } from "next-auth/react";

// ログインボタン
export const LoginButton = () => {
  return (
    <button className="mr-10" onClick={() => signIn()}>
      Sign in
    </button>
  );
};

// ログアウトボタン
export const LogoutButton = () => {
  return (
    <button className="mr-10" onClick={() => signOut()}>
      Sign Out
    </button>
  );
};

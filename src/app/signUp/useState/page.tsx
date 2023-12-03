import { Metadata } from "next";

import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "会員登録ページ - useState",
  description: "useStateを利用した会員登録ページです。",
};

// 会員登録ページは、SignUpFormコンポーネントを使用する。
const signUp = () => {
  return (
    <div className="container">
      <h1>会員登録 - useState</h1>
      <SignUpForm />
    </div>
  );
};
export default signUp;

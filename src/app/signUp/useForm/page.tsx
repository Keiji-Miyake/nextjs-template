// 会員登録ページを作成する。

import { Metadata } from "next";

import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "会員登録ページ - useForm",
  description: "useFormを利用した会員登録ページです。",
};

// 会員登録ページは、SignUpFormコンポーネントを使用する。
const signUp = () => {
  return (
    <div className="container">
      <h1>会員登録 - useForm</h1>
      <SignUpForm />
    </div>
  );
};
export default signUp;

import { Metadata } from "next";

import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "会員登録 - 入力",
  description: "会員登録の入力ページです。",
};

const SignUp = () => {
  return (
    <div className="container">
      <h1>会員登録 - 入力</h1>
      <RegisterForm />
    </div>
  );
};
export default SignUp;

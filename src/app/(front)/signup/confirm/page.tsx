import { Metadata } from "next";

import SignUpService from "@/domains/signup/service";

import RegisterForm from "./RegisterForm";

const signUpService = new SignUpService();

export const metadata: Metadata = {
  title: "会員登録 - 入力",
  description: "会員登録の入力ページです。",
};

const signUp = async ({ searchParams }: { searchParams: { token: string } }) => {
  const { token } = searchParams;
  try {
    const tokenInfo = await signUpService.get(token);
    if (!tokenInfo) throw new Error("Tokenが見つかりません。お手数ですが新規登録からやり直してください。");

    return (
      <div className="container">
        <h1>会員登録 - 入力</h1>
        <RegisterForm email={tokenInfo.email} />
      </div>
    );
  } catch (error) {
    console.error(`/signup/confirm`, error);
    throw error;
  }
};
export default signUp;

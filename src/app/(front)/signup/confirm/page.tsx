import { Metadata } from "next";

import { AppError } from "@/domains/error/class/AppError";

import { getRegistrationToken } from "./actions";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "会員登録 - 入力",
  description: "会員登録の入力ページです。",
};

const signUp = async ({ searchParams }: { searchParams: { token: string } }) => {
  const { token } = searchParams;
  try {
    const { email } = await getRegistrationToken(token);
    return (
      <div className="container">
        <h1>会員登録 - 入力</h1>
        <RegisterForm email={email} />
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError("INTERNAL_SERVER_ERROR", error.message);
    }
    throw error;
  }
};
export default signUp;

import { Metadata } from "next";

import { AppError } from "@/domains/error/class/AppError";
import { auth } from "@/libs/auth";

import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "サインインページ",
  description: "サインインページです。",
};

const signIn = async () => {
  const session = await auth();
  if (session) {
    throw new AppError("BAD_REQUEST", "既にログインしています。", "/");
  }
  return <SignInForm />;
};

export default signIn;

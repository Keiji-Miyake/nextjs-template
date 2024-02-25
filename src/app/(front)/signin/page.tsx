import { Metadata } from "next";

import { auth } from "@/libs/auth";

import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "サインインページ",
  description: "サインインページです。",
};

const signIn = async () => {
  const session = await auth();
  if (session) {
  }
  return <SignInForm />;
};

export default signIn;

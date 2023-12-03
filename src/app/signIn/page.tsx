import { Metadata } from "next";

import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "サインインページ",
  description: "サインインページです。",
};

const signIn = () => {
  return <SignInForm />;
};

export default signIn;

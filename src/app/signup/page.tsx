import { Metadata } from "next";

import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "会員申込",
  description: "会員申込ページです。",
};

const signUp = () => {
  return (
    <div className="container">
      <h1>会員申込</h1>
      <SignUpForm />
    </div>
  );
};
export default signUp;

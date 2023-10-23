// 会員登録ページを作成する。

import SignUpForm from "./SignUpForm";

// 会員登録ページは、SignUpFormコンポーネントを使用する。
const signUp = () => {
  return (
    <div className="container">
      <h1>会員登録</h1>
      <SignUpForm />
    </div>
  );
};
export default signUp;

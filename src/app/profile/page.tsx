import { Metadata } from "next";

import EditForm from "./EditForm";

export const metadata: Metadata = {
  title: "プロフィール編集ページ",
  description: "プロフィールの編集ページです。",
};

const Edit = () => {
  return (
    <div className="container">
      <h1>会員プロフィール編集</h1>
      <EditForm />
    </div>
  );
};

export default Edit;

import { Metadata } from "next";

import CreateForm from "./CreateForm";

export const metadata: Metadata = {
  title: "ユーザー作成ページ",
  description: "ユーザー作成ページ",
};

const page = () => {
  return (
    <div>
      <h2>ユーザー作成</h2>
      <CreateForm />
    </div>
  );
};

export default page;

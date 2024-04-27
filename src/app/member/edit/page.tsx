import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";

import MemberEditForm from "./MemberEditForm";

const page = async () => {
  const session = await getServerSession();
  if (!session?.user?.memberId) notFound();

  return (
    <div className="container">
      <h1>会員情報編集</h1>
      <MemberEditForm />
    </div>
  );
};

export default page;

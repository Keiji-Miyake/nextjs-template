"use client";

import { useUser } from "@/hooks/useUser";

const DataFetchWithSwr = () => {
  const { user, isLoading, isError } = useUser(1);
  if (isError) return <div>{isError}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-blue-300 w-64 py-4 px-6 rounded-md shadow-md">
      <span>お名前 : </span>
      <div>{user?.name}</div>
      <span>メールアドレス : </span>
      <div>{user?.email}</div>
    </div>
  );
};

export default DataFetchWithSwr;

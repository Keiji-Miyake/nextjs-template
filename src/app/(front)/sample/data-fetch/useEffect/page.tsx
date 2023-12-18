"use client";

import { Metadata } from "next";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "データフェッチ - useEffect",
  description: "useEffectを使ったデータフェッチのサンプルです。",
};

type User = {
  id: string;
  name: string;
  email: string;
};

const DataFetchWithUseEffect = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch(`https://jsonplaceholder.typicode.com/users/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          return res.json() as Promise<User | null>;
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          setError(error.message);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
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

export default DataFetchWithUseEffect;

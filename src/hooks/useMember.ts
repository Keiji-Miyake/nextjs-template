import { User } from "@prisma/client";
import useSWR from "swr";

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<User | null>);
}

export const useUser = (id: number) => {
  const { data, error } = useSWR(id ? `/api/user/${id}` : null, fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

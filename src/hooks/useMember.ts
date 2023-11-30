import { Member } from "@prisma/client";
import useSWR from "swr";

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<Member | null>);
}

export const useMember = (id: number) => {
  const { data, error } = useSWR(id ? `/api/member/${id}` : null, fetcher);

  return {
    member: data,
    isLoading: !error && !data,
    isError: error,
  };
};

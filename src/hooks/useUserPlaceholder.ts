import useSWR from "swr";

type User = {
  id: string;
  name: string;
  email: string;
};

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json() as Promise<User | null>);
}

export const useUserPlaceholder = (id: number) => {
  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    fetcher,
    {
      refreshInterval: 1000,
    },
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
};

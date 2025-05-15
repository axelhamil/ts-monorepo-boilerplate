import type { HttpResponse } from "@packages/libs";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { api } from "./config";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useGetUserQuery = <T = any>(): UseQueryResult<T | null> => {
  const retrieveUser = async (): Promise<T | null> => {
    const response = await api.get<HttpResponse<T>>("/api/v1");

    return response?.data?.data;
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: retrieveUser,
  });
};

import type { HttpResponse } from "@packages/libs";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getUser = async <T = any>(): Promise<{
  data: T | null;
  status: number;
}> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const res = (await response.json()) as HttpResponse<T>;

  return {
    data: res.data,
    status: response.status,
  };
};

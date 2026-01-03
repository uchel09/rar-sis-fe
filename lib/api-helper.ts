/* eslint-disable @typescript-eslint/no-explicit-any */
export class FetcherError extends Error {
  data: any;

  constructor(data: any) {
    super(data?.errors?.message || "Internal Server Error"); // tetap set message biar kompatibel
    this.data = data;
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ penting biar cookie HttpOnly ikut
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.log(error);
    throw error
  }

  return res.json();
}

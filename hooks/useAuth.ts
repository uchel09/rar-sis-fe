import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface FindMe {
  id: string;
  email: string;
  fullName: string;
  role: string;
  profile: {
    id: string
  } 
}
export interface LoginResponse {
  message: string;
  user: FindMe;
}

// ==========================
// ✅ Get current logged-in user
// ==========================
export function useMe() {
  return useQuery<
    { data: FindMe }, // ⬅️ data dari queryFn (API response)
    Error,
    FindMe // ⬅️ data SETELAH select
  >({
    queryKey: ["me"],
    queryFn: () =>
      fetcher<{ data: FindMe }>("/users/me", {
        method: "GET",
        credentials: "include",
      }),
    select: (res) => res.data, // 🔥 unwrap
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 10,
  });
}


// ==========================
// ✅ Login
// ==========================
export function useLogin() {
  const qc = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) =>
      fetcher<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // wajib biar cookie tersimpan
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"], exact: true });
    },
  });
}

// ==========================
// ✅ Logout
// ==========================
export function useLogout() {
  const qc = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationFn: () =>
      fetcher<{ message: string }>("/auth/logout", {
        method: "POST",
        credentials: "include", // biar hapus cookie
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"], exact: true });
    },
  });
}

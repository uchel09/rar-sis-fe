import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
import { Gender } from "@/lib/enum";
import { CreateStudentRequest } from "./useStudent";

// =======================
// 🧩 Request / Response
// =======================
export interface CreateParentRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address?: string;
  dob?: Date;
  nik: string;
  gender: Gender;
  isActive: boolean;
  studentIds?: string[]; // Optional list of student IDs to link
}

export interface UpdateParentRequest {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  dob?: Date;
  nik?: string;
  gender: Gender;
  isActive: boolean;
  studentIds?: string[]; // Update linked students
}

export interface ParentResponse {
  id: string;
  phone?: string;
  address?: string;
  dob: Date;
  nik: string;
  gender: Gender;
  user: {
    id: string;
    fullName: string;
    email: string;
    gender: Gender;
  };
  students?: {
    id: string;
    fullName: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =======================
// 📦 Queries
// =======================

// ✅ Ambil semua parent
export function useParents() {
  return useQuery<{ data: ParentResponse[] }>({
    queryKey: ["parents"],
    queryFn: () => fetcher<{ data: ParentResponse[] }>("/parents"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// ✅ Ambil satu parent by ID
export function useParent(id: string) {
  return useQuery<ParentResponse>({
    queryKey: ["parent", id],
    queryFn: () => fetcher<ParentResponse>(`/parents/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// =======================
// ✍️ Mutations
// =======================

// ✅ Create parent
export function useCreateParent() {
  const qc = useQueryClient();

  return useMutation<ParentResponse, Error, CreateParentRequest>({
    mutationFn: async (data) => {
      const res = await fetcher<{ data: ParentResponse }>("/parents", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      return res.data; // ambil yang di dalam { data: result }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parents"], exact: true });
    },
  });
}
export function useCreateParentStudentDraft() {
  const qc = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    {
      parentRequests: CreateParentRequest[];
      studentRequest: CreateStudentRequest;
    }
  >({
    mutationFn: async (data) => {
      const res = await fetcher<{ data: { message: string } }>(
        "/parents/with-student",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data; // berisi { message: "berhasil approve" }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parents"], exact: true });
      qc.invalidateQueries({ queryKey: ["students"], exact: true });
    },
  });
}


// ✅ Update parent
export function useUpdateParent(id: string) {
  const qc = useQueryClient();

  return useMutation<ParentResponse, Error, UpdateParentRequest>({
    mutationFn: (data) =>
      fetcher<ParentResponse>(`/parents/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parents"], exact: true });
      qc.invalidateQueries({ queryKey: ["parent", id], exact: true });
    },
  });
}

// ✅ Delete parent
export function useDeleteParent() {
  const qc = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/parents/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["parents"], exact: true }),
  });
}

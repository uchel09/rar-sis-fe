import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
import { Grade } from "@/lib/enum";


// ======================
// 🧩 Request DTOs
// ======================

export interface CreateClassRequest {
  schoolId: string;
  homeroomTeacherId?: string; 
  name: string;
  academicYearId: string;
  grade: Grade;
}

export interface UpdateClassRequest {
  homeroomTeacherId?: string;
  name?: string;
  academicYearId?: string;
  grade?: Grade;

}

// ======================
// 🧩 Response DTOs
// ======================

export interface ClassResponse {
  id: string;
  homeroomTeacher?: {
    id: string;
    fullname: string;
  };
  name: string;
  academicYear: {
    id: string;
    name: string;
  };
  grade: Grade;
  createdAt: Date;
  updatedAt: Date;
  
}

// ======================
// ✅ Hooks
// ======================

// Ambil semua class
export function useClasses() {
  return useQuery<{ data: ClassResponse[] }>({
    queryKey: ["classes"],
    queryFn: () => fetcher<{ data: ClassResponse[] }>("/classes"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// Ambil satu class by ID
export function useClass(id: string) {
  return useQuery<ClassResponse>({
    queryKey: ["class", id],
    queryFn: () => fetcher<ClassResponse>(`/classes/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useClassesByGrade(grade?: Grade) {
  return useQuery<{ data: ClassResponse[] }>({
    queryKey: ["classes", grade],
    queryFn: () =>
      fetcher<{ data: ClassResponse[] }>(`/classes/grade?grade=${grade}`),
    enabled: !!grade, // hanya jalan kalau grade ada
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// Create class
export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation<ClassResponse, Error, CreateClassRequest>({
    mutationFn: (data) =>
      fetcher<ClassResponse>("/classes", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes"]});
    },
  });
}

// Update class
export function useUpdateClass(id: string) {
  const qc = useQueryClient();
  return useMutation<ClassResponse, Error, UpdateClassRequest>({
    mutationFn: (data) =>
      fetcher<ClassResponse>(`/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes"] });
      qc.invalidateQueries({ queryKey: ["class", id], exact: true });
    },
  });
}

// Delete class
export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/classes/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes"], exact: true });
    },
  });
}

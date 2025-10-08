// src/hooks/useAcademicYear.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface CreateAcademicYearRequest {
  name: string; // contoh "2024/2025"
  startDate: Date; // kapan mulai
  endDate: Date; // kapan berakhir
  isActive?: boolean; // optional, default false
}

export interface UpdateAcademicYearRequest {
  id: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}
export interface AcademicYearResponse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AcademicYearListResponse {
  data: AcademicYearResponse[];
}
// ✅ Ambil semua Academic Year
export function useAcademicYears() {
  return useQuery<AcademicYearListResponse>({
    queryKey: ["academicYears"],
    queryFn: () => fetcher<AcademicYearListResponse>("/academic-years"),
    staleTime: Infinity, 
    gcTime: Infinity, 
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false,
    refetchInterval: false, 
  });
}

// ✅ Ambil satu Academic Year by ID
export function useAcademicYear(id: string) {
  return useQuery<AcademicYearResponse>({
    queryKey: ["academicYear", id],
    queryFn: async () => {
      const res = await fetcher<{ data: AcademicYearResponse }>(
        `/academic-years/${id}`
      );
      return res.data;
    },
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useAcademicYearActive() {
  return useQuery<AcademicYearResponse>({
    queryKey: ["academicYearActive"],
    queryFn: async () => {
      const res = await fetcher<{ data: AcademicYearResponse }>(
        "/academic-years/active"
      );
      return res.data; 
    },
    staleTime: Infinity, // cache selama app jalan
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Create Academic Year
export function useCreateAcademicYear() {
  const qc = useQueryClient();
  return useMutation<AcademicYearResponse, Error, CreateAcademicYearRequest>({
    mutationFn: (data) =>
      fetcher<AcademicYearResponse>("/academic-years", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academicYears"] }), // 🔄 invalidate manual
  });
}

// ✅ Update Academic Year
export function useUpdateAcademicYear(id: string) {
  const qc = useQueryClient();
  return useMutation<AcademicYearResponse, Error, UpdateAcademicYearRequest>({
    mutationFn: (data) =>
      fetcher<AcademicYearResponse>(`/academic-years/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["academicYears"] });
      qc.invalidateQueries({ queryKey: ["academicYear", id] });
    },
  });
}

// ✅ Delete Academic Year
export function useDeleteAcademicYear() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/academic-years/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["academicYears"] }),
  });
}

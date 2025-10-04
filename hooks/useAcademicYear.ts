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
    staleTime: Infinity, // ⏱ data dianggap selalu fresh, gak auto refetch
    gcTime: Infinity, // ♻️ simpan cache selamanya selama app jalan
    refetchOnWindowFocus: false, // 🚫 jangan refetch tiap pindah tab
    refetchOnReconnect: false, // 🚫 jangan refetch tiap reconnect network
    refetchInterval: false, // 🚫 jangan polling
  });
}

// ✅ Ambil satu Academic Year by ID
export function useAcademicYear(id: string) {
  return useQuery<AcademicYearResponse>({
    queryKey: ["academicYear", id],
    queryFn: () => fetcher<AcademicYearResponse>(`/academic-years/${id}`),
    enabled: !!id,
    staleTime: Infinity,
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


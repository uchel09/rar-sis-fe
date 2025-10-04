// src/hooks/useTeacher.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface CreateTeacherRequest {
  email: string;
  password: string;
  fullName: string;
  schoolId: string; // ID sekolah teacher
  nik: string; // Nomor induk teacher (unik)
  nip?: string; // Optional nomor pegawai
  hireDate: Date;
  dob: Date;
  phone: string;
  subjectClassTeacher?: { classId: string; subjectId: string }[];
}

// Request DTO untuk UPDATE
export interface UpdateTeacherRequest {
  fullName?: string; // Bisa update nama user
  dob?: Date;
  email?: string; // Bisa update email
  password?: string; // Bisa update password
  schoolId?: string; // Pindah sekolah
  nik?: string;
  nip?: string;
  hireDate?: Date;
  phone: string;
  subjectClassTeacher?: { classId: string; subjectId: string }[];
}

// Response DTO
export interface TeacherResponse {
  id: string; // ID teacher
  nik: string;
  nip?: string;
  schoolId: string;
  dob: Date;
  hireDate?: Date;
  phone: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  subjectClassTeacher?: SubjectClassTeacherResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectClassTeacherResponse {
  id: string;
  subjectId: string;
  classId: string;
  teacherId: string;
}

// ✅ Ambil semua teacher
export function useTeachers() {
  return useQuery<{ data: TeacherResponse[] }>({
    queryKey: ["teachers"],
    queryFn: () => fetcher<{ data: TeacherResponse[] }>("/teachers"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// ✅ Ambil satu teacher by ID
export function useTeacher(id: string) {
  return useQuery<TeacherResponse>({
    queryKey: ["teacher", id],
    queryFn: () => fetcher<TeacherResponse>(`/teachers/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Create teacher
export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation<TeacherResponse, Error, CreateTeacherRequest>({
    mutationFn: (data) =>
      fetcher<TeacherResponse>("/teachers", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["teachers"], exact: true }),
  });
}

// ✅ Update teacher
export function useUpdateTeacher(id: string) {
  const qc = useQueryClient();
  return useMutation<TeacherResponse, Error, UpdateTeacherRequest>({
    mutationFn: (data) =>
      fetcher<TeacherResponse>(`/teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"], exact: true });
      qc.invalidateQueries({ queryKey: ["teacher", id], exact: true });
    },
  });
}

// ✅ Delete teacher
export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/teachers/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["teachers"], exact: true }),
  });
}

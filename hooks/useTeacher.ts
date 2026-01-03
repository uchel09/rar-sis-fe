// src/hooks/useTeacher.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
import { Gender } from "@/lib/enum";

export interface CreateTeacherRequest {
  email: string;
  password: string;
  fullName: string;
  schoolId: string;
  nik: string;
  nip?: string;
  hireDate: Date;
  dob: Date;
  gender: Gender;
  phone: string;
}

// Request DTO untuk UPDATE
export interface UpdateTeacherRequest {
  fullName?: string;
  dob?: Date;
  email?: string;
  password?: string;
  nik?: string;
  nip?: string;
  hireDate?: Date;
  phone: string;
  gender: Gender;
  isActive: boolean;
}

export interface TeacherResponse {
  id: string; // ID teacher
  nik: string;
  nip?: string;
  dob: Date;
  hireDate: Date;
  phone: string;
  isActive: boolean;
  user: {
    gender: Gender;
    id: string;
    fullName: string;
    email: string;
  };
  subjectTeachers: SubjectTeacherResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectTeacherResponse {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherFullName: string;
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

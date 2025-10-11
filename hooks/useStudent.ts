// src/model/student.model.ts

import { Gender } from "@/lib/enum";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface CreateStudentRequest {
  email: string;
  password: string;
  fullName: string;
  schoolId: string;
  classId?: string;
  enrollmentNumber?: string;
  dob: Date;
  isActive: boolean;
  address?: string;
  gender: Gender;
  parentIds?: string[]; // jika ingin langsung assign parent
}

export interface UpdateStudentRequest {
  email?: string;
  password?: string;
  fullName?: string;
  schoolId?: string;
  classId?: string;
  enrollmentNumber?: string;
  dob?: Date;
  isActive?: boolean;
  address?: string;
  gender: Gender;
  parentIds?: string[]; // update relasi parent
}

export interface StudentResponse {
  id: string;
  schoolId: string;
  class?: {
    id: string;
    name: string; // ✅ ambil field nama class
    grade: string; // kalau ada field tambahan
  };
  enrollmentNumber: string | null;
  dob: Date;
  address?: string;
  user: {
    gender: Gender;
    id: string;
    fullName: string;
    email: string;
  };
  parents: {
    id: string;
    fullName: string;
    email: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// src/hooks/useStudent.ts

// =======================
// ✅ Ambil semua student
// =======================
export function useStudents() {
  return useQuery<{ data: StudentResponse[] }>({
    queryKey: ["students"],
    queryFn: () => fetcher<{ data: StudentResponse[] }>("/students"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// =======================
// ✅ Ambil satu student by ID
// =======================
export function useStudent(id: string) {
  return useQuery<StudentResponse>({
    queryKey: ["student", id],
    queryFn: () => fetcher<StudentResponse>(`/students/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// =======================
// ✅ Create student
// =======================
export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation<StudentResponse, Error, CreateStudentRequest>({
    mutationFn: (data) =>
      fetcher<StudentResponse>("/students", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["students"], exact: true }),
  });
}

// =======================
// ✅ Update student
// =======================
export function useUpdateStudent(id: string) {
  const qc = useQueryClient();
  return useMutation<StudentResponse, Error, UpdateStudentRequest>({
    mutationFn: (data) =>
      fetcher<StudentResponse>(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"], exact: true });
      qc.invalidateQueries({ queryKey: ["student", id], exact: true });
    },
  });
}

// =======================
// ✅ Delete student
// =======================
export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/students/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["students"], exact: true }),
  });
}

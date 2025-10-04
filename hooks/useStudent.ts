import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

// src/model/student.model.ts

export interface CreateStudentRequest {
  email: string;
  password: string;
  fullName: string;
  schoolId: string;
  classId?: string;
  enrollmentNumber: string;
  dob: string; // lebih aman string (ISO), bukan Date langsung
  address?: string;
  parentIds?: string[];
}

export interface UpdateStudentRequest {
  email?: string;
  password?: string;
  fullName?: string;
  schoolId?: string;
  classId?: string;
  enrollmentNumber?: string;
  dob?: string;
  address?: string;
  parentIds?: string[];
}

export interface StudentResponse {
  id: string;
  schoolId: string;
  class?: {
    id: string;
    name: string; // ✅ ambil field nama class
    grade: string; // kalau ada field tambahan
  } | null;
  enrollmentNumber: string;
  dob: Date;
  address?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  parents: {
    id: string;
    fullName: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Hooks

export function useStudents() {
  return useQuery<StudentResponse[]>({
    queryKey: ["students"],
    queryFn: () => fetcher<StudentResponse[]>("/students"),
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentRequest) =>
      fetcher<StudentResponse>("/students", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStudentRequest) =>
      fetcher<StudentResponse>(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", id] });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetcher<{ message: string }>(`/students/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

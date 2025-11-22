import { Grade } from "@/lib/enum";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
export interface CreateSubjectRequest {
  name: string;
  grade: Grade;
  schoolId: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  grade?: Grade;
}

export interface SubjectTeacherResponse {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherFullName: string;
}


export interface SubjectResponse {
  id: string;
  name: string;
  grade: Grade;
  createdAt: Date;
  updatedAt: Date;
  subjectTeachers: SubjectTeacherResponse[];
}

export function useSubject(id: string) {
  return useQuery<SubjectResponse>({
    queryKey: ["subject", id],
    queryFn: () => fetcher<SubjectResponse>(`/subjects/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
export function useSubjects() {
  return useQuery<{ data: SubjectResponse[] }>({
    queryKey: ["subjects"],
    queryFn: () => fetcher<{ data: SubjectResponse[] }>("/subjects"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// =======================
// ✅ Create subject
// =======================
export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation<SubjectResponse, Error, CreateSubjectRequest>({
    mutationFn: (data) =>
      fetcher<SubjectResponse>("/subjects", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["subjects"], exact: true }),
  });
}

// =======================
// ✅ Update subject
// =======================
export function useUpdateSubject(id: string) {
  const qc = useQueryClient();
  return useMutation<SubjectResponse, Error, UpdateSubjectRequest>({
    mutationFn: (data) =>
      fetcher<SubjectResponse>(`/subjects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"], exact: true });
      qc.invalidateQueries({ queryKey: ["subject", id], exact: true });
    },
  });
}

// =======================
// ✅ Delete subject
// =======================
export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/subjects/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["subjects"], exact: true }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

// =======================
// 🧩 Interfaces
// =======================

export interface CreateSubjectTeacherRequest {
  subjectId: string;
  teacherId: string;
}

export interface UpdateSubjectTeacherRequest {
  subjectId?: string;
  teacherId?: string;
}

export interface SubjectTeacherResponse {
  id: string;
  subject?: {
    id: string;
    name: string;
  };
  teacher?: {
    id: string;
    user: {
      fullname: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// =======================
// ✅ Get all SubjectTeachers
// =======================
export function useSubjectTeachers() {
  return useQuery<{ data: SubjectTeacherResponse[] }>({
    queryKey: ["subjectTeachers"],
    queryFn: () =>
      fetcher<{ data: SubjectTeacherResponse[] }>("/subject-teachers"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// =======================
// ✅ Get single SubjectTeacher by ID
// =======================
export function useSubjectTeacher(id: string) {
  return useQuery<SubjectTeacherResponse>({
    queryKey: ["subjectTeacher", id],
    queryFn: () => fetcher<SubjectTeacherResponse>(`/subject-teachers/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// =======================
// ✅ Create SubjectTeacher
// =======================
export function useCreateSubjectTeacher() {
  const qc = useQueryClient();
  return useMutation<
    SubjectTeacherResponse,
    Error,
    CreateSubjectTeacherRequest
  >({
    mutationFn: (data) =>
      fetcher<SubjectTeacherResponse>("/subject-teachers", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["subjectTeachers"], exact: true }),
  });
}

// =======================
// ✅ Update SubjectTeacher
// =======================
export function useUpdateSubjectTeacher(id: string) {
  const qc = useQueryClient();
  return useMutation<
    SubjectTeacherResponse,
    Error,
    UpdateSubjectTeacherRequest
  >({
    mutationFn: (data) =>
      fetcher<SubjectTeacherResponse>(`/subject-teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjectTeachers"], exact: true });
      qc.invalidateQueries({ queryKey: ["subjectTeacher", id], exact: true });
    },
  });
}

// =======================
// ✅ Delete SubjectTeacher
// =======================
export function useDeleteSubjectTeacher() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/subject-teachers/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["subjectTeachers"], exact: true }),
  });
}

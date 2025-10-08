import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
import { DraftStatus, DraftType, Grade } from "@/lib/enum";
// =======================
// 🧩 Interface Request/Response
// =======================
export interface CreateStudentDraftRequest {
  email: string;
  fullName: string;
  schoolId: string;
  targetClassId?: string;
  academicYearId: string;
  studentId?: string;
  enrollmentNumber?: string;
  dob: Date;
  address?: string;
  grade: Grade;
  createdBy?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;

  parents: {
    id?: string;
    fullName: string;
    phone: string;
    address?: string;
    email: string;
  }[];

  draftType: DraftType;
  status?: DraftStatus;
}

export interface UpdateStudentDraftRequest {
  email?: string;
  fullName?: string;
  targetClassId?: string;
  enrollmentNumber?: string;
  academicYearId?: string;
  studentId: string;
  dob?: Date;
  address?: string;
  grade?: Grade;
  createdBy?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;

  parents?: {
    id?: string;
    fullName: string;
    phone?: string;
    address?: string;
    email?: string;
  }[];

  draftType?: DraftType;
  status?: DraftStatus;
}

export interface StudentDraftResponse {
  id: string;
  email: string;
  fullName: string;
  schoolId: string;
  enrollmentNumber?: string;
  targetClassId?: string;
  academicYear: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    fullname: string;
    classId: string;
    className: string;
  };
  dob: Date;
  address?: string;
  grade: Grade;
  createdBy?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;

  parents: {
    id?: string;
    fullName: string;
    phone: string;
    address?: string;
    email: string;
  }[];

  draftType: DraftType;
  status: DraftStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentDraftListResponse {
  data: StudentDraftResponse[];
}

// =======================
// 📘 Query Hooks
// =======================

// ✅ Ambil semua Student Draft
export function useStudentDrafts() {
  return useQuery<StudentDraftListResponse>({
    queryKey: ["studentDrafts"],
    queryFn: () => fetcher<StudentDraftListResponse>("/student-drafts"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Ambil Student Draft berdasarkan ID
export function useStudentDraft(id: string) {
  return useQuery<StudentDraftResponse>({
    queryKey: ["studentDraft", id],
    queryFn: async () => {
      const res = await fetcher<{ data: StudentDraftResponse }>(
        `/student-drafts/${id}`
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

// =======================
// 🧠 Mutation Hooks
// =======================

// ✅ Create Student Draft
export function useCreateStudentDraft() {
  const qc = useQueryClient();
  return useMutation<StudentDraftResponse, Error, CreateStudentDraftRequest>({
    mutationFn: (data) =>
      fetcher<StudentDraftResponse>("/student-drafts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["studentDrafts"] }),
  });
}

// ✅ Update Student Draft
export function useUpdateStudentDraft(id: string) {
  const qc = useQueryClient();
  return useMutation<StudentDraftResponse, Error, UpdateStudentDraftRequest>({
    mutationFn: (data) =>
      fetcher<StudentDraftResponse>(`/student-drafts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studentDrafts"] });
      qc.invalidateQueries({ queryKey: ["studentDraft", id] });
    },
  });
}

// ✅ Delete Student Draft
export function useDeleteStudentDraft() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/student-drafts/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["studentDrafts"] }),
  });
}

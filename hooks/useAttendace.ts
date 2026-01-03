import { AttendanceStatus, DayOfWeek, Semester } from "@/lib/enum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface GenerateBulkAttendanceRequest {
  classId: string;
  subjectTeacherId: string;
  semester: Semester;
}

export interface AttendanceBulkResponse {
  count: number;
  classId: string;
  subjectTeacherId: string;
  teacherName: string;
  subjectName: string;
  semester: Semester;
  students: {
    studentId: string;
    fullName: string;
  }[];
  attendances: AttendanceItem[];
}

export interface AttendanceItem {
  id: string;
  date: Date;
  semester: Semester;
  approve: boolean;
  attendancesDetails: AttendanceDetail[];
  timetable: {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: Date;
    endTime: Date;
    classId: string;
    subjectTeacherid: string | null;
  };
}
export interface AttendanceDetail {
  id: string;
  attendanceId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string;
}

// DTO untuk create AttendanceDetail
export interface CreateAttendanceDetailDto {
  students: { studentId: string; fullName: string }[];
  defaultStatus?: AttendanceStatus;
}

// DTO untuk bulk update AttendanceDetail
export interface UpdateAttendanceDetailDto {
  updates: { studentId: string; status?: AttendanceStatus; note?: string }[];
  approve?: boolean;
}

export interface AttendanceDetailItem {
  id: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note: string | null;
}


// =====================
// Bulk Attendance Hooks
// =====================
export function useGenerateBulkAttendance() {
  const qc = useQueryClient();

  return useMutation<
    AttendanceBulkResponse,
    Error,
    GenerateBulkAttendanceRequest
  >({
    mutationFn: (body) =>
      fetcher("/attendances/bulk/generate", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),

    onSuccess: (_, body) => {
      qc.invalidateQueries({
        queryKey: [
          "attendance",
          "bulk",
          body.classId,
          body.subjectTeacherId,
          body.semester,
        ],
      });
    },
  });
}


export function useDeleteBulkAttendance() {
  return useMutation<
    AttendanceBulkResponse,
    Error,
    GenerateBulkAttendanceRequest
  >({
    mutationFn: (body) =>
      fetcher("/attendances/bulk", {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  });
}

export function useGetBulkAttendance(body: GenerateBulkAttendanceRequest) {
  return useQuery<AttendanceBulkResponse>({
    queryKey: [
      "attendance",
      "bulk",
      body.classId,
      body.subjectTeacherId,
      body.semester,
    ],
    queryFn: () => {
      const query = new URLSearchParams({
        classId: body.classId,
        subjectTeacherId: body.subjectTeacherId,
        semester: body.semester,
      });

      return fetcher(`/attendances/bulk?${query.toString()}`, {
        method: "GET",
      });
    },
    enabled: !!body.classId && !!body.subjectTeacherId && !!body.semester,
    staleTime: Infinity,
  });
}

// =====================
// AttendanceDetail Hooks
// =====================

// 1️⃣ Create AttendanceDetail
export function useCreateAttendanceDetail(attendanceId: string) {
  const qc = useQueryClient();
  return useMutation<
    { created: number; message: string },
    Error,
    CreateAttendanceDetailDto
  >({
    mutationFn: (body) =>
      fetcher(`/attendances/details/${attendanceId}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      // Re-fetch bulk attendance
      qc.invalidateQueries({
        queryKey: ["attendance", "bulk"],
      });
    },
  });
}

// 2️⃣ Get AttendanceDetail by attendanceId
export function useGetAttendanceDetail(attendanceId: string) {
  return useQuery<AttendanceDetailItem[]>({
    queryKey: ["attendanceDetail", attendanceId],
    queryFn: () =>
      fetcher<AttendanceDetailItem[]>(`/attendances/details/${attendanceId}`, {
        method: "GET",
      }),
    enabled: !!attendanceId,
  });
}

// 3️⃣ Bulk Update + Approve AttendanceDetail
export function useBulkUpdateAttendanceDetail(attendanceId: string) {
  const qc = useQueryClient();
  return useMutation<
    { totalUpdated: number; attendanceApproved: boolean; message: string },
    Error,
    UpdateAttendanceDetailDto
  >({
    mutationFn: (body) =>
      fetcher(`/attendances/details/${attendanceId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      // Re-fetch bulk attendance
      qc.invalidateQueries({
        queryKey: ["attendance", "bulk"],
      });
    },
  });
}

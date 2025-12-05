import { Semester } from "@/lib/enum";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";

export interface GenerateBulkAttendanceRequest {
  classId: string;
  subjectTeacherId: string;
  semester: Semester;
}

export interface AttendanceBulkItem {
  id: string;
  timetableId: string;
  schoolId: string;
  date: string;
  semester: Semester;
  approve: boolean;
}

export interface AttendanceBulkResponse {
  data: AttendanceBulkItem[];
  created?: number;
  deleted?: number;
  range?: { start: Date; end: Date };
  message: string;
}
export function useGenerateBulkAttendance() {
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


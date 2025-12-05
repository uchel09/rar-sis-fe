import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-helper";
import { DayOfWeek, Grade } from "@/lib/enum";

export interface CreateTimetableRequest {
  schoolId: string;
  subjectTeacherid?: string;
  classId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
}

export interface UpdateTimetableRequest {
  subjectTeacherid: string;
  classId?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
export interface InsertSubjectTeacherRequest {
  subjectTeacherid: string;
  isActive?: boolean;
}


export interface TimetableResponse {
  id: string;
  classId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  class?: {
    id: string;
    name: string;
    grade: Grade;
  } | null;
  subjectTeacher?: {
    id: string;
    teacherId: string;
    teacherFullname: string;
    subjectId: string;
    subjectName: string;
  } | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


// =======================
// ✅ Ambil semua timetable
// =======================
export function useTimetables() {
  return useQuery<{ data: TimetableResponse[] }>({
    queryKey: ["timetables"],
    queryFn: () => fetcher<{ data: TimetableResponse[] }>("/timetables"),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

// =======================
// ✅ Ambil timetable by ID
// =======================
export function useTimetable(id: string) {
  return useQuery<TimetableResponse>({
    queryKey: ["timetable", id],
    queryFn: () => fetcher<TimetableResponse>(`/timetables/${id}`),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// =======================
// ✅ Ambil timetable by Class ID
// =======================
export function useTimetablesByClassId(classId: string, schoolId: string) {
  return useQuery<{ data: TimetableResponse[] }>({
    queryKey: ["timetables", "class", classId],
    queryFn: () =>
     fetcher(`/timetables/class?schoolId=${schoolId}&classId=${classId}`),
    enabled: !!classId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}
export function useTimetablesByTeacherId(teacherId: string, schoolId: string) {
  return useQuery<{ data: TimetableResponse[] }>({
    queryKey: ["timetables", "teacher", teacherId],
    queryFn: () =>
      fetcher(
        `/timetables/teacher?schoolId=${schoolId}&teacherId=${teacherId}`
      ),
    enabled: !!teacherId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}


// =======================
// ✅ Create timetable
// =======================
export function useCreateTimetable() {
  const qc = useQueryClient();
  return useMutation<TimetableResponse, Error, CreateTimetableRequest>({
    mutationFn: (data) =>
      fetcher<TimetableResponse>("/timetables", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timetables"] }),
  });
}

// =======================
// ✅ Update timetable
// =======================
export function useUpdateTimetable(id: string) {
  const qc = useQueryClient();
  return useMutation<TimetableResponse, Error, UpdateTimetableRequest>({
    mutationFn: (data) =>
      fetcher<TimetableResponse>(`/timetables/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetables"] });
      qc.invalidateQueries({ queryKey: ["timetable", id] });
    },
  });
}
export function useInsertSubjectTeacher(id: string) {
  const qc = useQueryClient();
  return useMutation<TimetableResponse, Error, InsertSubjectTeacherRequest>({
    mutationFn: (data) =>
      fetcher<TimetableResponse>(`/timetables/subject-teacher/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetables"] });
      qc.invalidateQueries({ queryKey: ["timetable", id] });
    },
  });
}

// =======================
// ✅ Delete timetable
// =======================
export function useDeleteTimetable() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      fetcher<{ message: string }>(`/timetables/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timetables"] }),
  });
}

// =======================
// ✅ Generate Weekly Timetables
// =======================
export function useGenerateWeeklyTimetables() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { schoolId: string }>({
    mutationFn: ({ schoolId }) =>
      fetcher<{ message: string }>(`/timetables/generate-tt`, {
        method: "POST",
        body: JSON.stringify(schoolId),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timetables"] }),
  });
}


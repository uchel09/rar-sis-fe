import { create } from "zustand";
import { TeacherResponse } from "@/hooks/useTeacher";

interface TeacherState {
  teachers: TeacherResponse[]; // Semua data guru
  teacherById: Record<string, TeacherResponse>; // Guru berdasarkan ID
  setTeachers: (teachers: TeacherResponse[]) => void; // Set semua guru
  setTeacherById: (teacher: TeacherResponse) => void; // Simpan guru by ID
  clearTeachers: () => void; // Hapus semua data guru
}

export const useTeacherStore = create<TeacherState>((set) => ({
  teachers: [],
  teacherById: {},

  setTeachers: (teachers) =>
    set({
      teachers,
      teacherById: Object.fromEntries(teachers.map((t) => [t.id, t])),
    }),

  setTeacherById: (teacher) =>
    set((state) => ({
      teacherById: { ...state.teacherById, [teacher.id]: teacher },
      teachers: state.teachers.some((t) => t.id === teacher.id)
        ? state.teachers
        : [...state.teachers, teacher],
    })),

  clearTeachers: () => set({ teachers: [], teacherById: {} }),
}));

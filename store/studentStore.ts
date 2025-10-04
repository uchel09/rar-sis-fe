import { create } from "zustand";

interface StudentState {
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  selectedStudentId: null,
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
}));

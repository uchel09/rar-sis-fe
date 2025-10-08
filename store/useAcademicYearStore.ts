import { create } from "zustand";
import { AcademicYearResponse } from "@/hooks/useAcademicYear";

interface AcademicYearState {
  activeAcademicYear: AcademicYearResponse | null;
  setActiveAcademicYear: (year: AcademicYearResponse) => void;
  clearActiveAcademicYear: () => void;
}

export const useAcademicYearStore = create<AcademicYearState>((set) => ({
  activeAcademicYear: null,
  setActiveAcademicYear: (year) => set({ activeAcademicYear: year }),
  clearActiveAcademicYear: () => set({ activeAcademicYear: null }),
}));

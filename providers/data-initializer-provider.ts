"use client";

import { useEffect } from "react";
import { useAcademicYearActive } from "@/hooks/useAcademicYear";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";

export function DataInitializerProvider() {
  const { data } = useAcademicYearActive();
  const setActiveAcademicYear = useAcademicYearStore(
    (s) => s.setActiveAcademicYear
  );

  useEffect(() => {
    if (data) setActiveAcademicYear(data);
  }, [data, setActiveAcademicYear]);

  return null; 
}

"use client";

import { useGetBulkAttendance } from "@/hooks/useAttendace";
import { useStudentsByClassId } from "@/hooks/useStudent";
import { Semester } from "@/lib/enum";
import React from "react";

interface TeacherStudentAttTabProps {
  subjectTeacherId: string;
  schoolId: string;
  classId: string;
}

export default function TeacherStudentAttTab({
  subjectTeacherId,
  schoolId,
  classId,
}: TeacherStudentAttTabProps) {
      const { data: studentData, isLoading: isLoadStudent } = useStudentsByClassId(classId);
      const { data: attendanceData, isLoading: isLoadAtt } =
        useGetBulkAttendance({classId, subjectTeacherId, semester: Semester.SEMESTER_1});
      console.log(studentData)
      console.log("Attendance Data",attendanceData)
  return (
    <div>
      <h3>Attendance Kelas</h3>

      <ul>
        <li>Teacher ID: {subjectTeacherId}</li>
        <li>School ID: {schoolId}</li>
        <li>Class ID: {classId}</li>
      </ul>

      {/* 
        👉 Di sini kamu nanti isi:
        - fetch students by classId
        - fetch attendance detail
        - form input
        - table 
      */}
      <p>Silakan isi komponen attendance kelas di sini.</p>
    </div>
  );
}

"use client"

import TeacherTimetablePage from "@/components/timetable/teacher-timetable/teacher-timetable";
import { useMe } from "@/hooks/useAuth";

import React from 'react'

const SchedulePage = () => {
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !me) {
    return <div>Unauthorized</div>;
  }

  const profileId = me.profile?.id;
  if (!profileId) {
    return <div>Profil guru belum lengkap</div>;
  }
  return (
    <TeacherTimetablePage
      teacherId={profileId}
      schoolId={process.env.NEXT_PUBLIC_SCHOOL_ID|| ""}
    />
  );
};

export default SchedulePage;

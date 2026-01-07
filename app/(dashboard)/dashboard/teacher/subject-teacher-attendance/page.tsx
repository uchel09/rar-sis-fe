"use client";

import TeacherStudentAtt from "@/components/studentAttendance/teacher-studentAtt/teacher-studentAtt";
import { useMe } from "@/hooks/useAuth";

const SubjectTeacherAttendancePage = () => {
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
    <TeacherStudentAtt
      teacherId={profileId}
      schoolId={process.env.NEXT_PUBLIC_SCHOOL_ID||""}
    />
  );
};

export default SubjectTeacherAttendancePage;

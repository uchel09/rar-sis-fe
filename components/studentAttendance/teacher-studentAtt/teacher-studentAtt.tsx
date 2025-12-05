"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Spin } from "antd";
import { useTimetablesByTeacherId } from "@/hooks/useTimetable";
import TeacherStudentAttTab from "./tabs-component/tabs-component";

export default function TeacherStudentAtt({
  teacherId,
  schoolId,
}: {
  teacherId: string;
  schoolId: string;
}) {
  const { data, isLoading } = useTimetablesByTeacherId(teacherId, schoolId);

  const [classes, setClasses] = useState<
    {
      classId: string;
      className: string;
      subjects: { subjectTeacherId: string; subjectName: string }[];
    }[]
  >([]);

  useEffect(() => {
    const timetables = data?.data ?? [];

    // Map class level
    const map = new Map<
      string,
      {
        className: string;
        subjects: { subjectTeacherId: string; subjectName: string }[];
      }
    >();

    timetables.forEach((item) => {
      if (!item.classId || !item.class?.name || !item.subjectTeacher) return;

      if (!map.has(item.classId)) {
        map.set(item.classId, {
          className: item.class.name,
          subjects: [],
        });
      }

      const entry = map.get(item.classId)!;

      // Avoid duplicate subjectTeacher for same class
      if (
        !entry.subjects.some(
          (s) => s.subjectTeacherId === item.subjectTeacher!.id
        )
      ) {
        entry.subjects.push({
          subjectTeacherId: item.subjectTeacher.id,
          subjectName: item.subjectTeacher.subjectName,
        });
      }
    });

    const arr = Array.from(map, ([classId, value]) => ({
      classId,
      className: value.className,
      subjects: value.subjects.sort((a, b) =>
        a.subjectName.localeCompare(b.subjectName)
      ),
    }));

    // SORT kelas (VII A, VII B, VIII A, ...)
    arr.sort((a, b) => a.className.localeCompare(b.className));

    setClasses(arr);
  }, [data]);

  if (isLoading) return <Spin />;

  return (
    <Tabs
      defaultActiveKey={classes[0]?.classId}
      items={classes.map((cls) => ({
        key: cls.classId,
        label: cls.className,

        children: (
          <Tabs
            tabPosition="top"
            defaultActiveKey={cls.subjects[0]?.subjectTeacherId}
            items={cls.subjects.map((subj) => ({
              key: subj.subjectTeacherId,
              label: subj.subjectName,
              children: (
                <div style={{ padding: "1rem" }}>
                  <TeacherStudentAttTab
                   
                    schoolId={schoolId}
                    classId={cls.classId}
                    subjectTeacherId={subj.subjectTeacherId}
                  />
                </div>
              ),
            }))}
          />
        ),
      }))}
    />
  );
}

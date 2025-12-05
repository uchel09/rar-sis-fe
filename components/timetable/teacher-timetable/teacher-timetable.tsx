/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Card, Spin, Empty, Modal } from "antd";
import { useTimetablesByTeacherId } from "@/hooks/useTimetable";
import "./teacher-timetable.scss";

const dayOrder: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export default function TeacherTimetablePage({
  teacherId,
  schoolId,
}: {
  teacherId: string;
  schoolId: string;
}) {
  const { data, isLoading } = useTimetablesByTeacherId(teacherId, schoolId);

  // STATE hanya ini
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const grouped = useMemo(() => {
    if (!data?.data) return {};

    const sorted = [...data.data].sort((a, b) => {
      const dayDiff = dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    const groups: Record<string, typeof sorted> = {};
    sorted.forEach((tt) => {
      if (!groups[tt.dayOfWeek]) groups[tt.dayOfWeek] = [];
      groups[tt.dayOfWeek].push(tt);
    });

    return groups;
  }, [data]);

  if (isLoading) return <Spin />;

  if (!data?.data?.length)
    return <Empty description="Jadwal tidak ditemukan" />;

  return (
    <div className="teacher-timetable">
      {Object.entries(grouped).map(([day, items]) => (
        <Card key={day} title={day} bordered className="day-card">
          {items.map((item) => (
            <div
              key={item.id}
              className="subject-item"
              onClick={() => {
                setSelectedTimetable(item); // simpan FULL item
                setIsModalOpen(true); // buka modal
              }}
            >
              <div className="left">
                <div className="subject-name">
                  {item.subjectTeacher?.subjectName}
                </div>
                <div className="class-info">
                  Kelas: {item.class?.grade} {item.class?.name}
                </div>
              </div>

              <div className="right">
                <div className="time">
                  {item.startTime} - {item.endTime}
                </div>
                <div className="status">
                  {item.isActive ? "Aktif" : "Tidak Aktif"}
                </div>
              </div>
            </div>
          ))}
        </Card>
      ))}

      {/* MODAL SEDERHANA */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
        title="Detail Timetable"
        okText= "Buat Absensi"
      >
        <p>Timetable ID: {selectedTimetable?.id}</p>
        <p>Class ID: {selectedTimetable?.classId}</p>
        <p>SubjectTeacher ID: {selectedTimetable?.subjectTeacherId}</p>

        <pre style={{ marginTop: 10, opacity: 0.6 }}>
          {JSON.stringify(selectedTimetable, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SetStateAction, useState } from "react";
import { Modal, Select } from "antd";
import {
  useTimetablesByClassId,
  useUpdateTimetable,
} from "@/hooks/useTimetable";
import GlobalLoading from "@/components/custom/globalLoading/globalLoading";
import "./time-table.scss";
import { useSubjectTeachers } from "@/hooks/useSubjectTeacher";

interface TimetablePageProps {
  id: string;
}

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const dayLabels: Record<string, string> = {
  MONDAY: "Senin",
  TUESDAY: "Selasa",
  WEDNESDAY: "Rabu",
  THURSDAY: "Kamis",
  FRIDAY: "Jumat",
  SATURDAY: "Sabtu",
};

export default function TimetablePage({ id }: TimetablePageProps) {
  const { data, isLoading } = useTimetablesByClassId(
    id,
    "a352d11d-3407-4a71-a299-031e3d22c5c8"
  );

  const { data: subjectTeachers, isLoading: isLoadingST } =
    useSubjectTeachers();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectTeacherId, setSelectedSubjectTeacherId] = useState<
    string | null
  >(null);
  const updateTimetableMutation = useUpdateTimetable(selectedSlotId ?? "");

  if (isLoading || isLoadingST) return <GlobalLoading />;

  const timetables = data?.data ?? [];
  const subjectTeacherList = subjectTeachers?.data ?? [];

  // 🔹 Kelompokkan berdasarkan hari
  const groupedByDay = days.reduce((acc, day) => {
    acc[day] = timetables
      .filter((t) => t.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<string, typeof timetables>);

  // 🔹 Buka modal
  const handleOpenModal = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsModalOpen(true);
  };

  // 🔹 Simpan perubahan
  const handleSave = async () => {
    if (!selectedSlotId || !selectedSubjectTeacherId) return;

    try {
      await updateTimetableMutation.mutateAsync({
        subjectTeacherid: selectedSubjectTeacherId,
        isActive: true,
      });

      setIsModalOpen(false);
      setSelectedSlotId(null);
      setSelectedSubjectTeacherId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="timetable-horizontal">
      {/* Header Hari */}
      <div className="timetable-header">
        {days.map((day) => (
          <div key={day} className="timetable-header__day">
            {dayLabels[day]}
          </div>
        ))}
      </div>

      {/* Isi Jadwal */}
      <div className="timetable-body">
        {days.map((day) => (
          <div key={day} className="timetable-column">
            {groupedByDay[day].length > 0 ? (
              groupedByDay[day].map((slot) => (
                <div
                  key={slot.id}
                  className="timetable-slot"
                  onClick={() => handleOpenModal(slot.id)}
                >
                  <div className="slot__subject">
                    {slot.subjectTeacher?.subjectName || "Tidak ada mapel"}
                  </div>
                  <div className="slot__teacher">
                    {slot.subjectTeacher?.teacherFullname || "—"}
                  </div>
                  <div className="slot__time">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
              ))
            ) : (
              <div className="timetable-empty">Tidak ada jadwal</div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Pilih Subject Teacher */}
      <Modal
        title="Pilih Guru dan Mapel"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Simpan"
        cancelText="Batal"
      >
        <p>Pilih Subject Teacher untuk slot ini:</p>
        <Select
          style={{ width: "100%" }}
          placeholder="Pilih subject teacher"
          onChange={(val: SetStateAction<string | null>) => setSelectedSubjectTeacherId(val)}
          options={subjectTeacherList.map((st: any) => ({
            value: st.id,
            label: `${st.subject.name} — ${st.teacher.user.fullname}`,
          }))}
        />
      </Modal>
    </div>
  );
}

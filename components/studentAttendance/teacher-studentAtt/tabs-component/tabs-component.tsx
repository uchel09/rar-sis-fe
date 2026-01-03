/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Semester, AttendanceStatus } from "@/lib/enum";
import {
  useCreateAttendanceDetail,
  useGetBulkAttendance,
  useGetAttendanceDetail,
  useBulkUpdateAttendanceDetail,
  AttendanceDetailItem,
  useGenerateBulkAttendance,
} from "@/hooks/useAttendace";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./tabs-component.module.scss";
import { Input, Table, Modal } from "antd";
import { useAppMessage } from "@/providers/query-client-provider";
import GlobalLoading from "@/components/custom/globalLoading/globalLoading";

interface TeacherStudentAttTabProps {
  subjectTeacherId: string;
  classId: string;
}

const dayMap: Record<string, string> = {
  MONDAY: "Senin",
  TUESDAY: "Selasa",
  WEDNESDAY: "Rabu",
  THURSDAY: "Kamis",
  FRIDAY: "Jumat",
  SATURDAY: "Sabtu",
  SUNDAY: "Minggu",
};

export default function TeacherStudentAttTab({
  subjectTeacherId,
  classId,
}: TeacherStudentAttTabProps) {
  const { data: attendanceData, isLoading } = useGetBulkAttendance({
    classId,
    subjectTeacherId,
    semester: Semester.SEMESTER_1,
  });
  const { messageApi } = useAppMessage();
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    string | null
  >(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const createAttendanceDetail = useCreateAttendanceDetail(
    selectedAttendanceId || ""
  );
  const generateAttendanceBulk = useGenerateBulkAttendance();
  const handleGenerateAttendance = async () => {
    if (!attendanceData) return;
    try {
      await generateAttendanceBulk.mutateAsync({
        classId: attendanceData?.classId,
        subjectTeacherId: attendanceData?.subjectTeacherId,
        semester: attendanceData?.semester,
      });

      // optional: notif sukses
      messageApi.success("List Absensi Semester berhasil dibuat");
    } catch (err: any) {
      messageApi.error("Internal Server error");
    }
  };

  const sortedDates = useMemo(() => {
    return attendanceData
      ? [...attendanceData.attendances].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      : [];
  }, [attendanceData]);

  const sortedStudents = useMemo(() => {
    return attendanceData
      ? [...attendanceData.students].sort((a, b) =>
          a.fullName.localeCompare(b.fullName, "en", {
            numeric: true,
            sensitivity: "base",
          })
        )
      : [];
  }, [attendanceData]);

  // ⬇️ LOOKUP: attendanceId → studentId → status
  const attendanceLookup = useMemo(() => {
    if (!attendanceData) return {};

    const map: Record<
      string,
      Record<string, { status: AttendanceStatus; note?: string }>
    > = {};

    for (const att of attendanceData.attendances) {
      map[att.id] = {};
      for (const d of att.attendancesDetails ?? []) {
        map[att.id][d.studentId] = { status: d.status, note: d.note };
      }
    }

    return map;
  }, [attendanceData]);

  const getCellClass = (status?: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return styles["status-present"];
      case AttendanceStatus.ABSENT:
        return styles["status-absent"];
      case AttendanceStatus.SICK:
        return styles["status-sick"];
      case AttendanceStatus.EXCUSED:
        return styles["status-excused"];
      default:
        return styles["status-empty"];
    }
  };

  if (isLoading || generateAttendanceBulk.isPending) return <p>Loading...</p>;
  if (!attendanceData) return <p>No data</p>;

  // =======================
  // HANDLE CLICK HEADER
  // =======================
  const handleDateClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setShowConfirmModal(true);
  };
  const handleDateClickEdit = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setShowEditModal(true);
  };

  // ======================= Absensi Functional
  // HANDLE CONFIRM CREATE
  // =======================
  const handleConfirmCreate = async () => {
    if (!selectedAttendanceId) return;

    setConfirmLoading(true);

    try {
      await createAttendanceDetail.mutateAsync({
        students: sortedStudents,
        defaultStatus: AttendanceStatus.PRESENT,
      });
      // sukses → tutup confirm → buka attendance modal
      setShowAttendanceModal(true);
      setShowConfirmModal(false);
      messageApi.success(
        "Absensi dibuat, Silahkan Jalankan proses absensi dan approve"
      );
    } catch (error) {
      console.error(error);
      messageApi.error("Absensi gagal dibuat, coba lagi nanti");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    if (!selectedAttendanceId) return;

    setShowEditModal(false);
    setShowAttendanceModal(true);
  };

  // =======================
  // HANDLE CANCEL
  // =======================
  const handleCancel = () => {
    setSelectedAttendanceId(null);
    setShowConfirmModal(false);
  };

  return (
    <div className={styles.tableWrapper}>
      {sortedDates.length === 0 && (
        <div className={styles.noData}>
          <p className={styles.noDataP}>Tidak ada data absensi</p>
          <button
            className={styles.generateButton}
            onClick={ handleGenerateAttendance}
          >
            Buat absensi semester
          </button>
        </div>
      )}
      <table className={styles.attTable}>
        <thead>
          <tr>
            <th className={styles.stickyCol}>No</th>
            <th className={styles.stickyCol}>Nama Siswa</th>
            {sortedDates.map((att, idx) => {
              const d = new Date(att.date);
              const dayName = dayMap[att.timetable.dayOfWeek] || "-";

              return (
                <th key={att.id}>
                  <div className={styles.headCell}>
                    {!att.approve && att.attendancesDetails.length !== 0 ? (
                      <>
                        <span
                          style={{ color: "red" }}
                          className={styles.dateNumber}
                        >
                          Belum Approve
                        </span>
                        <span style={{ color: "red" }}>{dayName}</span>
                        <span style={{ color: "red" }}>
                          {d.toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.dateNumber}>{idx + 1}</span>
                        <span>{dayName}</span>
                        <span>{d.toLocaleDateString()}</span>
                      </>
                    )}
                    {att.attendancesDetails.length !== 0 ? (
                      <button
                        onClick={() => handleDateClickEdit(att.id)}
                        className={styles.buttonEdit}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className={styles.buttonCreate}
                        onClick={() => handleDateClick(att.id)}
                      >
                        create
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedStudents.map((s, index) => (
            <tr key={s.studentId}>
              <td className={styles.stickyCol}>{index + 1}</td>
              <td className={styles.stickyCol}>{s.fullName}</td>

              {sortedDates.map((att) => {
                const detail = attendanceLookup?.[att.id]?.[s.studentId];
                const status = detail?.status;
                const className = getCellClass(status);

                return (
                  <td
                    key={att.id + s.studentId}
                    style={{ textAlign: "center" }}
                  >
                    <div className={className}>{status ?? "-"}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* ===== CONFIRM MODAL ===== */}
      <Modal
        open={showConfirmModal}
        title="Konfirmasi Absensi"
        onOk={handleConfirmCreate}
        onCancel={handleCancel}
        okText={confirmLoading ? "Loading..." : "confirm"}
        cancelText="Cancel"
      >
        <p>Submit absensi untuk tanggal ini?</p>
      </Modal>

      <Modal
        open={showEditModal}
        title="Edit Absensi"
        onOk={handleConfirmEdit}
        onCancel={handleCancel}
        okText="Edit"
        cancelText="Cancel"
      >
        <p>Edit absensi untuk tanggal ini?</p>
      </Modal>

      {/* ===== ATTENDANCE MODAL ===== */}
      {showAttendanceModal && selectedAttendanceId && (
        <AttendanceModal
          attendanceId={selectedAttendanceId}
          onClose={() => setShowAttendanceModal(false)}
          showAttendanceModal={showAttendanceModal}
        />
      )}
    </div>
  );
}

// =======================
// AttendanceModal dengan AntD
// =======================
interface AttendanceModalProps {
  attendanceId: string;
  showAttendanceModal: boolean;
  onClose: () => void;
}

// =======================
// STATUS SWITCH
// =======================
const STATUS_OPTIONS = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.ABSENT,
  AttendanceStatus.SICK,
  AttendanceStatus.EXCUSED,
];

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "Pre",
  ABSENT: "Abs",
  SICK: "Sick",
  EXCUSED: "Exc",
};

function AttendanceModal({
  attendanceId,
  showAttendanceModal,
  onClose,
}: AttendanceModalProps) {
  const { data, isLoading, refetch } = useGetAttendanceDetail(attendanceId);
  const bulkUpdate = useBulkUpdateAttendanceDetail(attendanceId);
  const { messageApi } = useAppMessage();
  const [updates, setUpdates] = useState<
    { studentId: string; status: AttendanceStatus; note?: string }[]
  >([]);

  // 🔁 refetch setiap modal dibuka
  useEffect(() => {
    if (showAttendanceModal) {
      refetch().catch(() => {
        messageApi.error("Gagal refresh data absensi");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAttendanceModal, refetch]);

  // ✅ SORT DATA (WAJIB)
  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) =>
      a.studentName.localeCompare(b.studentName, "id", {
        sensitivity: "base",
        numeric: true,
      })
    );
  }, [data]);

  // init updates dari sortedData
  useEffect(() => {
    if (!sortedData.length) return;

    setUpdates(
      sortedData.map((d) => ({
        studentId: d.studentId,
        status: d.status,
        note: d.note ?? "",
      }))
    );
  }, [sortedData]);

  if (!showAttendanceModal) return null;
  if (isLoading) {
    return <GlobalLoading />;
  }

  const handleChangeStatus = (studentId: string, status: AttendanceStatus) => {
    setUpdates((prev) =>
      prev.map((u) => (u.studentId === studentId ? { ...u, status } : u))
    );
  };

  const handleChangeNote = (studentId: string, note: string) => {
    setUpdates((prev) =>
      prev.map((u) => (u.studentId === studentId ? { ...u, note } : u))
    );
  };

  const handleSubmit = async () => {
    try {
      await bulkUpdate.mutateAsync({
        updates,
        approve: true,
      });
      messageApi.success("Sukses update absensi");
      onClose();
    } catch (error) {
      messageApi.error("Gagal Update Absensi");
      console.log(error);
    }
  };

  const handleClose = () => {
    setUpdates([]);
    onClose();
  };

  const columns = [
    {
      title: "Nama Siswa",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: AttendanceDetailItem) => {
        const current = updates.find(
          (u) => u.studentId === record.studentId
        )?.status;

        return (
          <div className={styles.switch}>
            <div
              className={styles.indicator}
              style={{
                transform: `translateX(${
                  STATUS_OPTIONS.indexOf(current!) * 100
                }%)`,
              }}
            />

            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                className={`${styles.item} ${
                  current === status ? styles.active : ""
                }`}
                onClick={() => handleChangeStatus(record.studentId, status)}
              >
                {STATUS_LABEL[status]}
              </button>
            ))}
          </div>
        );
      },
    },
    {
      title: "Catatan",
      key: "note",
      render: (_: any, record: AttendanceDetailItem) => (
        <Input
          value={updates.find((u) => u.studentId === record.studentId)?.note}
          onChange={(e: { target: { value: string } }) =>
            handleChangeNote(record.studentId, e.target.value)
          }
        />
      ),
    },
  ];

  return (
    <Modal
      open={showAttendanceModal}
      title="Absensi"
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={bulkUpdate.isPending}
      okText="Simpan & Approve"
      cancelText="Batal"
      width={900}
    >
      <Table
        dataSource={sortedData}
        columns={columns}
        rowKey="studentId"
        pagination={false}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
}

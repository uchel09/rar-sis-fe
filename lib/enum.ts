// ======================
// 🧩 Role untuk sistem user
// ======================
export enum Role {
  SUPERADMIN = "SUPERADMIN",
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  PARENT = "PARENT",
  STAFF = "STAFF",
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  GRADUATED = "GRADUATED",
  TRANSFERRED = "TRANSFERRED",
}

// ======================
// 🧩 Status kehadiran siswa
// ======================
export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  SICK = "SICK",
  PERMISSION = "PERMISSION",
  LATE = "LATE", // siswa terlambat
  EXCUSED = "EXCUSED", // izin resmi (beda dengan permission biasa)
}

// ======================
// 🧩 Semester
// ======================
export enum Semester {
  SEMESTER_1 = "SEMESTER_1",
  SEMESTER_2 = "SEMESTER_2",
}

// ======================
// 🧩 Status draft (pendaftaran, pindah sekolah, naik kelas)
// ======================
export enum DraftStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED", // tahan kelas, atau tidak diterima untuk siswa baru
  APPROVED_PENDING = "APPROVED_PENDING",
}

// ======================
// 🧩 Jenis draft
// ======================
export enum DraftType {
  NEW_ENROLLMENT = "NEW_ENROLLMENT", // siswa baru masuk
  TRANSFER_IN = "TRANSFER_IN", // pindahan masuk
  TRANSFER_OUT = "TRANSFER_OUT", // pindahan keluar
  TRANSFER_UP ="TRANSFER_UP", // naik kelas
  GRADUATED = "GRADUATED", // sudah lulus
}

// ======================
// 🧩 Posisi staff sekolah
// ======================
export enum StaffPosition {
  ADMINISTRATION = "ADMINISTRATION",
  FINANCE = "FINANCE",
  LIBRARY = "LIBRARY",
  SECURITY = "SECURITY",
  CLEANING = "CLEANING",
  FOODCOURT = "FOODCOURT",
  SHOP = "SHOP",
  BUSINESS = "BUSINESS",
  OTHER = "OTHER",
}

// ======================
// 🧩 Hari dalam seminggu
// ======================
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

// ======================
// 🧩 Jenjang / tingkat kelas
// ======================
export enum Grade {
  // SD
  GRADE_1 = "GRADE_1",
  GRADE_2 = "GRADE_2",
  GRADE_3 = "GRADE_3",
  GRADE_4 = "GRADE_4",
  GRADE_5 = "GRADE_5",
  GRADE_6 = "GRADE_6",

  // SMP
  GRADE_7 = "GRADE_7",
  GRADE_8 = "GRADE_8",
  GRADE_9 = "GRADE_9",

  // SMA
  GRADE_10 = "GRADE_10",
  GRADE_11 = "GRADE_11",
  GRADE_12 = "GRADE_12",
}

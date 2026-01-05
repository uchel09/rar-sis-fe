"use client";

import { useMe } from "@/hooks/useAuth";
import styles from "./teacher-dashboard.module.scss";

const TeacherDashboardPage = () => {
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (isError || !me) {
    return <div className={styles.error}>Gagal memuat data user</div>;
  }

  console.log(me)

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1>Dashboard Guru</h1>
          <p>
            Selamat datang, <b>{me.fullName}</b>
          </p>
        </div>

        <span className={styles.role}>{me.role}</span>
      </header>

      {/* Profile Card */}
      <section className={styles.card}>
        <h2>Profil</h2>

        <div className={styles.profileGrid}>
          <div>
            <label>Email</label>
            <span>{me.email}</span>
          </div>

          <div>
            <label>Nama Lengkap</label>
            <span>{me.fullName}</span>
          </div>

          <div>
            <label>Role</label>
            <span>{me.role}</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.actions}>
        <button>📚 Kelas Saya</button>
        <button>📝 Input Nilai</button>
        <button>📆 Jadwal Mengajar</button>
      </section>
    </div>
  );
};

export default TeacherDashboardPage;

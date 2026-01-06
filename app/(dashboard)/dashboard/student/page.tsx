"use client";

import { useMe } from "@/hooks/useAuth";
import styles from "./student.module.scss";
import { Clock, BookOpen, GraduationCap, Calendar, ChevronRight } from "lucide-react";

export default function StudentDashboardPage() {
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) return <div className={styles.loading}>Memuat data siswa...</div>;
  if (isError || !me) return <div className={styles.error}>Gagal memuat profil siswa.</div>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Halo, {me.fullName} 👋</h1>
        <p>Selamat datang kembali! Berikut ringkasan aktivitas akademikmu hari ini.</p>
      </header>

      {/* Stats Overview */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.label}>Kehadiran</div>
          <div className={styles.value}>94%</div>
          <div className={styles.desc}>Sangat Baik (Minggu ke-12)</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Tugas Pending</div>
          <div className={styles.value} style={{ color: '#eab308' }}>3</div>
          <div className={styles.desc}>2 Deadline Hari Ini</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Rata-rata Nilai</div>
          <div className={styles.value} style={{ color: '#22c55e' }}>88.5</div>
          <div className={styles.desc}>Semester Ganjil 2024</div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={styles.dashboardGrid}>
        {/* Today's Schedule */}
        <section className={styles.section}>
          <h2>
            <span><Clock style={{ marginRight: '0.5rem', width: '1.2rem' }} /> Jadwal Hari Ini</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 'normal' }}>Senin, 24 Jan</span>
          </h2>

          <div className={styles.scheduleList}>
            {/* Mock Schedule Items */}
            <div className={styles.scheduleItem}>
              <div className={styles.time}>07:30</div>
              <div className={styles.details}>
                <h4>Matematika Wajib</h4>
                <p>Pak Budi Santoso • Ruang 101</p>
              </div>
              <span className={styles.status}>Hadir</span>
            </div>

            <div className={styles.scheduleItem}>
              <div className={styles.time}>09:30</div>
              <div className={styles.details}>
                <h4>Bahasa Indonesia</h4>
                <p>Ibu Sri Wahyuni • Ruang 102</p>
              </div>
              <span className={styles.status} style={{ background: '#fee2e2', color: '#b91c1c' }}>Telat</span>
            </div>

            <div className={styles.scheduleItem}>
              <div className={styles.time}>13:00</div>
              <div className={styles.details}>
                <h4>Fisika Dasar</h4>
                <p>Pak Herman • Lab Fisika</p>
              </div>
              <span className={styles.status} style={{ background: '#f1f5f9', color: '#64748b' }}>Upcoming</span>
            </div>
          </div>
        </section>

        {/* Quick Actions & Announcements */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className={styles.section}>
            <h2>Menu Cepat</h2>
            <div className={styles.actionGrid}>
              <button>
                <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><BookOpen size={18} /> Tugas Saya</span>
                <ChevronRight size={16} />
              </button>
              <button>
                <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><GraduationCap size={18} /> Transkrip Nilai</span>
                <ChevronRight size={16} />
              </button>
              <button>
                <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Calendar size={18} /> Kalender Akademik</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Pengumuman</h2>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--secondary)' }}>
              <p style={{ marginBottom: '1rem' }}>📢 <b>Ujian Tengah Semester</b> akan dimulai tanggal 5 Februari 2025. Harap persiapkan diri.</p>
              <p>🏀 <b>Porseni</b> dibuka pendaftarannya mulai besok di ruang OSIS.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
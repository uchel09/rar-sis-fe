import {
    BookOpen,
    CalendarCheck,
    GraduationCap,
    LayoutDashboard,
    Users,
    LineChart
} from "lucide-react";
import styles from "../home.module.scss";

const features = [
    {
        icon: <LayoutDashboard />,
        title: "Dashboard Intuitif",
        desc: "Akses informasi penting sekolah dalam satu tampilan yang mudah dipahami.",
    },
    {
        icon: <Users />,
        title: "Manajemen Siswa & Guru",
        desc: "Kelola data siswa, guru, dan staff dengan database yang terpusat.",
    },
    {
        icon: <CalendarCheck />,
        title: "Absensi Real-time",
        desc: "Pantau kehadiran siswa dan guru secara langsung setiap hari.",
    },
    {
        icon: <BookOpen />,
        title: "Manajemen Akademik",
        desc: "Atur jadwal pelajaran, kurikulum, dan materi pembelajaran dengan mudah.",
    },
    {
        icon: <GraduationCap />,
        title: "Penilaian & Rapor",
        desc: "Input nilai, hitung rata-rata, dan cetak rapor secara otomatis.",
    },
    {
        icon: <LineChart />,
        title: "Laporan & Statistik",
        desc: "Dapatkan wawasan mendalam tentang progres akademik sekolah Anda.",
    },
];

export default function Features() {
    return (
        <section id="features" className={`${styles.section} ${styles.features}`}>
            <div className={styles.container}>
                <div className={styles.featuresHeaders}>
                    <h2 className={styles.fadeUp}>Fitur Unggulan</h2>
                    <p className={`${styles.fadeUp} ${styles.delay1}`}>
                        Semua yang Anda butuhkan untuk mengelola sekolah modern ada di sini.
                    </p>
                </div>

                <div className={styles.featureGrid}>
                    {features.map((feature, idx) => (
                        <div key={idx} className={`${styles.featureCard} ${styles.fadeUp}`} style={{ animationDelay: `${(idx + 1) * 0.1}s` }}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

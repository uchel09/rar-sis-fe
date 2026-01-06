import Link from "next/link";
import styles from "../home.module.scss";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1>
                            Platform Manajemen Sekolah <span>Terintegrasi</span>
                        </h1>
                        <p>
                            Kelola administrasi, akademik, dan absensi sekolah Anda dalam satu
                            platform yang mudah digunakan, modern, dan aman.
                        </p>
                        <div className={styles.authButtons}>
                            <Link href="/login" className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
                                Mulai Sekarang
                            </Link>
                            <Link href="#features" className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <div className={styles.blob}></div>
                        {/* Placeholder for Hero Image */}
                        <div style={{
                            width: '100%',
                            height: '300px',
                            background: 'white',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--secondary)',
                            border: '1px solid var(--border)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            Visual Dashboard Preview
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import styles from "../home.module.scss";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={`${styles.fadeUp}`}>
                            Platform Manajemen Sekolah <span>Terintegrasi</span>
                        </h1>
                        <p className={`${styles.fadeUp} ${styles.delay1}`}>
                            Kelola administrasi, akademik, dan absensi sekolah Anda dalam satu
                            platform yang mudah digunakan, modern, dan aman.
                        </p>
                        <div className={`${styles.authButtons} ${styles.fadeUp} ${styles.delay2}`}>
                            <Link href="/login" className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
                                Mulai Sekarang
                            </Link>
                            <Link href="#features" className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                    <div className={`${styles.heroVisual} ${styles.fadeUp} ${styles.delay3}`}>
                        <div className={styles.blob}></div>
                        {/* Glass Dashboard Mockup */}
                        <div className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.sidebar}></div>
                                <div className={styles.content}>
                                    <div className={styles.row}></div>
                                    <div className={styles.row}></div>
                                    <div className={styles.row}></div>
                                    <div className={styles.chartStub}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

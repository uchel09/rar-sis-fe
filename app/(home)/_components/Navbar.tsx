import Link from "next/link";
import styles from "../home.module.scss";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container} style={{ width: "100%" }}>
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        🎓 SIS Skolah
                    </Link>

                    <div className={styles.navLinks}>
                        <Link href="/">Beranda</Link>
                        <Link href="#features">Fitur</Link>
                        <Link href="#about">Tentang</Link>
                        <Link href="#contact">Kontak</Link>
                    </div>

                    <div className={styles.authButtons}>
                        <Link href="/login" className={`${styles.btn} ${styles.btnOutline}`}>
                            Masuk
                        </Link>
                        <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

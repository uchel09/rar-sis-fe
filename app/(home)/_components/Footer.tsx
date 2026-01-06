import styles from "../home.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.logo} style={{ fontSize: "1.2rem" }}>
                        🎓 SIS Skolah
                    </div>
                    <div className={styles.navLinks} style={{ gap: "1.5rem" }}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Help Center</a>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Sistem Informasi Sekolah. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

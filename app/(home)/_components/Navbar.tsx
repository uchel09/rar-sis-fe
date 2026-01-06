"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "../home.module.scss";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container} style={{ width: "100%" }}>
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        🎓 SIS Skolah
                    </Link>

                    {/* Desktop Links */}
                    <div className={styles.navLinks}>
                        <Link href="/">Beranda</Link>
                        <Link href="#features">Fitur</Link>
                        <Link href="#about">Tentang</Link>
                        <Link href="#contact">Kontak</Link>
                    </div>

                    <div className={`${styles.authButtons} ${styles.desktopAuth}`}>
                        <Link href="/login" className={`${styles.btn} ${styles.btnOutline}`}>
                            Masuk
                        </Link>
                        <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Daftar
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
                <Link href="/" onClick={() => setIsOpen(false)}>Beranda</Link>
                <Link href="#features" onClick={() => setIsOpen(false)}>Fitur</Link>
                <Link href="#about" onClick={() => setIsOpen(false)}>Tentang</Link>
                <Link href="#contact" onClick={() => setIsOpen(false)}>Kontak</Link>
                <div className={styles.authButtons}>
                    <Link href="/login" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setIsOpen(false)}>
                        Masuk
                    </Link>
                    <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsOpen(false)}>
                        Daftar
                    </Link>
                </div>
            </div>
        </nav>
    );
}

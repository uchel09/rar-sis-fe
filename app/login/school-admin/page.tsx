"use client"

import React, { useState } from "react";
import { redirect } from "next/navigation";
import styles from "./school-admin.login.module.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", { email, password });
    // nanti bisa connect ke API
    redirect("/dashboardxzx"); //
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}> Login School Admin</h2>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.button} type="submit">
          Login
        </button>

        <p className={styles.footerText}>© 2025 Sekolah Portal</p>
      </form>
    </div>
  );
}

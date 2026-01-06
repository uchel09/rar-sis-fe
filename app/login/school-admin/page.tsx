"use client";

import React, { useState } from "react";
import styles from "./school-admin.login.module.scss";
import { useLogin } from "@/hooks/useAuth";
import { useAppMessage } from "@/providers/query-client-provider";
import GlobalLoading from "@/components/custom/globalLoading/globalLoading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { messageApi } = useAppMessage();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    login.mutate(
      { email, password }, // input sesuai LoginRequest
      {
        onSuccess: (res) => {
          console.log(res);
          // misal redirect ke dashboard
          messageApi.success(res?.message);
          // redirect sesuai role
          const role = res.user.role;
          if (role === "TEACHER") window.location.replace("/dashboard/teacher");
          else if (role === "STUDENT")
            window.location.replace("/dashboard/student");
          else if (role === "SCHOOL_ADMIN")
            window.location.replace("/dashboardxzx");
          else window.location.replace("/");
          
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          if (err.errors === "Validation Error") {
            messageApi.error("Email atau password salah");
          } else {
            messageApi.error(err.errors.message);
          }
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}> Login School Dashboard</h2>

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

        <button
          className={styles.button}
          type="submit"
          disabled={submitting || login.isPending}
        >
          {login.isPending || submitting ? "Loading..." : "Login"}
        </button>

        { login.isPending || submitting ? <GlobalLoading /> :  null}
        <p className={styles.footerText}>© 2025 Sekolah Portal</p>
      </form>
    </div>
  );
}

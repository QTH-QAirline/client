"use client";
import { useContext } from "react";
import styles from "./ForgotPassword.module.css";
import { LanguageContext } from "../../../../utils/LanguageContext";

const ForgotPassword = () => {
  const { locale } = useContext(LanguageContext);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.icon}
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4l-10 8-10-8" />
          </svg>
        </div>

        <h2 className={styles.title}>
          {locale === "en" ? "Check Your Email" : "Kiểm Tra Email"}
        </h2>

        <p className={styles.message}>
          {locale === "en"
            ? "Please check your email to reset your password."
            : "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."}
        </p>

        <div className={styles.divider}></div>

        <p className={styles.spamNotice}>
          {locale === "en"
            ? "Didn't receive the email? Check your spam folder"
            : "Không nhận được email? Hãy kiểm tra thư mục spam"}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

"use client";
import { useContext, useState, FormEvent } from "react";
import styles from "./ForgotPassword.module.css";
import { LanguageContext } from "../../../../utils/LanguageContext";

const ForgotPassword = () => {
  const { locale } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập gửi request (thay thế bằng API thực tế của bạn)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowNotification(true);
    setIsSubmitting(false);
    setEmail("");
  };

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
          {locale === "en" ? "Forgot Password" : "Quên Mật Khẩu"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                locale === "en" ? "Enter your email" : "Nhập email của bạn"
              }
              required
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? locale === "en"
                ? "Sending..."
                : "Đang gửi..."
              : locale === "en"
              ? "Reset Password"
              : "Đặt Lại Mật Khẩu"}
          </button>
        </form>

        {showNotification && (
          <div className={styles.overlay}>
            <div className={styles.notification}>
              <div className={styles.notificationIcon}>✉️</div>
              <h3 className={styles.notificationTitle}>
                {locale === "en" ? "Check Your Email" : "Kiểm Tra Email"}
              </h3>
              <p className={styles.notificationMessage}>
                {locale === "en"
                  ? "Please check your email to reset your password."
                  : "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."}
              </p>
              <button
                className={styles.okButton}
                onClick={() => setShowNotification(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

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

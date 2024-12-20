"use client";
import { useContext, useState, FormEvent, ChangeEvent } from "react";
import { LanguageContext } from "../../../../utils/LanguageContext";
import Link from "next/link";
import styles from "./ResetPassword.module.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = () => {
  const { locale } = useContext(LanguageContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (pass: string) => {
    const errors: string[] = [];
    const requirements = [
      {
        test: (p: string) => p.length >= 8,
        message:
          locale === "en" ? "At least 8 characters long" : "Ít nhất 8 ký tự",
      },
      {
        test: (p: string) => /[A-Z]/.test(p),
        message:
          locale === "en" ? "One uppercase letter" : "Một chữ cái viết hoa",
      },
      {
        test: (p: string) => /[a-z]/.test(p),
        message:
          locale === "en" ? "One lowercase letter" : "Một chữ cái viết thường",
      },
      {
        test: (p: string) => /[0-9]/.test(p),
        message: locale === "en" ? "One number" : "Một số",
      },
      {
        test: (p: string) => /[!@#$%^&*]/.test(p),
        message:
          locale === "en"
            ? "One special character (!@#$%^&*)"
            : "Một ký tự đặc biệt (!@#$%^&*)",
      },
    ];

    requirements.forEach((req) => {
      if (!req.test(pass)) {
        errors.push(req.message);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { errors } = validatePassword(newPassword);
    setPasswordErrors(errors);
    setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const { isValid, errors } = validatePassword(password);
    setPasswordErrors(errors);

    if (!isValid) return;

    if (password !== confirmPassword) {
      setError(
        locale === "en" ? "Passwords do not match" : "Mật khẩu không khớp"
      );
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>
            {locale === "en"
              ? "Password Reset Successfully"
              : "Đặt Lại Mật Khẩu Thành Công"}
          </h2>
          <p className={styles.message}>
            {locale === "en"
              ? "Your password has been reset. You can now log in with your new password."
              : "Mật khẩu của bạn đã được đặt lại. Bây giờ bạn có thể đăng nhập với mật khẩu mới."}
          </p>
          <Link href="/login" className={styles.link}>
            {locale === "en" ? "← Back to Login" : "← Quay lại Đăng nhập"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {locale === "en" ? "Reset Password" : "Đặt Lại Mật Khẩu"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className={`${styles.input} ${
                  passwordErrors.length > 0 ? styles.errorInput : ""
                }`}
                placeholder=" "
              />
              <label className={styles.label}>
                {locale === "en" ? "New Password" : "Mật Khẩu Mới"}
              </label>
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className={styles.requirements}>
                <p className={styles.requirementsTitle}>
                  {locale === "en"
                    ? "Password requirements:"
                    : "Yêu cầu mật khẩu:"}
                </p>
                {passwordErrors.map((error, index) => (
                  <div key={index} className={styles.requirement}>
                    <span className={styles.dot}>•</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${error ? styles.errorInput : ""}`}
                placeholder=" "
              />
              <label className={styles.label}>
                {locale === "en" ? "Confirm Password" : "Xác Nhận Mật Khẩu"}
              </label>
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button type="submit" className={styles.button}>
            {locale === "en" ? "Reset Password" : "Đặt Lại Mật Khẩu"}
          </button>

          <Link href="/login" className={styles.link}>
            {locale === "en" ? "← Back to Login" : "← Quay lại Đăng nhập"}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Login.module.css";
import Image from "next/image";
import logoImage from "/public/images/logo.png";
import { LanguageContext } from "../../../../utils/LanguageContext";
import { en, vi } from "../../../../utils/locales";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.login : vi.login;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.identifier.trim()) {
      newErrors.identifier = translations.errors.requiredIdentifier;
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      if (
        !emailRegex.test(formData.identifier) &&
        !phoneRegex.test(formData.identifier)
      ) {
        newErrors.identifier = translations.errors.invalidIdentifier;
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = translations.errors.requiredPassword;
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = translations.errors.shortPassword;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:4000/auth/customer/login",
          {
            email: formData.identifier,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Lưu thông tin đăng nhập thành công vào localStorage
        const userData = {
          email: formData.identifier,
          token: response.data.token, // Hoặc thông tin cần thiết khác
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // console.log("Đăng nhập thành công:", response.data);

        // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
        // Chuyển hướng đến trang chủ
        router.push("/");

        // Đợi một chút để đảm bảo router.push đã được thực hiện
        setTimeout(() => {
          window.location.reload();
        }, 100); //reload lại trang
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Lỗi đăng nhập:",
            error.response?.data || error.message
          );
        } else {
          console.error("Lỗi đăng nhập:", error);
        }
        setErrors((prev) => ({
          ...prev,
          identifier: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        }));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Link href="http://localhost:3000" className={styles.logoLink}>
          <div className={styles.logo}>
            <Image
              src={logoImage}
              alt="QAirline Logo"
              width={24}
              height={24}
              className={styles.logoIcon}
            />
            <span>QAirline</span>
          </div>
        </Link>

        <h1 className={styles.title}>{translations.title}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={errors.identifier ? styles.errorInput : ""}
              placeholder=" "
            />
            <span>{translations.emailOrPhone}</span>
            {errors.identifier && (
              <span className={styles.error}>{errors.identifier}</span>
            )}
          </div>

          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ""}
              placeholder=" "
            />
            <span>{translations.password}</span>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            {translations.loginButton}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/forgot-password">{translations.forgotPassword}</Link>
          <p>
            {translations.noAccount}{" "}
            <Link href="/signup" className={styles.link}>
              {translations.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

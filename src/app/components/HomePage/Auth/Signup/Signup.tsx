"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Signup.module.css";
import Image from "next/image";
import logoImage from "/public/images/logo.png";
import { LanguageContext } from "../../../../utils/LanguageContext";
import { en, vi } from "../../../../utils/locales";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Signup = () => {
  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.signup : vi.signup;

  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // Function to handle capitalization and remove Vietnamese accents
  const capitalizeAndRemoveAccents = (str: string) => {
    // Remove Vietnamese accents
    const removeAccents = (str: string) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    };

    // Capitalize each word
    const capitalize = (str: string) => {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };

    return capitalize(removeAccents(str));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Special handling for fullName
    if (name === "fullName") {
      processedValue = capitalizeAndRemoveAccents(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = translations.errors.fullNameRequired;
      isValid = false;
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = translations.errors.fullNameTooShort;
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = translations.errors.emailInvalid;
      isValid = false;
    }

    // Validate phone (required)
    if (!formData.phone) {
      newErrors.phone = translations.errors.phoneRequired;
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = translations.errors.phoneInvalid;
      isValid = false;
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = translations.errors.passwordTooShort;
      isValid = false;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translations.errors.passwordMismatch;
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
          BACKEND_URL+'/auth/customer/register',
          {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Đăng ký thành công:', response.data);
  
        // Chuyển hướng đến trang login sau khi đăng ký thành công
        router.push('/login');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Lỗi đăng ký:', error.response?.data?.error || error.message);
          setErrors((prev) => ({
            ...prev,
            email: error.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.',
          }));
        } else {
          console.error('Lỗi không xác định:', error);
        }
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
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.errorInput : ""}
              placeholder=" "
            />
            <label htmlFor="fullName">{translations.fullName}</label>
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ""}
              placeholder=" "
            />
            <label htmlFor="email">{translations.email}</label>
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.errorInput : ""}
              placeholder=" "
            />
            <label htmlFor="phone">{translations.phone}</label>
            {errors.phone && (
              <span className={styles.error}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ""}
              placeholder=" "
            />
            <label htmlFor="password">{translations.password}</label>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.errorInput : ""}
              placeholder=" "
            />
            <label htmlFor="confirmPassword">
              {translations.confirmPassword}
            </label>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            {translations.submitButton}
          </button>
        </form>

        <div className={styles.links}>
          <p>
            {translations.loginLink}{" "}
            <Link href="/login" className={styles.link}>
              {locale === "en" ? "Login" : "Đăng Nhập"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

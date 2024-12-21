"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import adminLoginData from "../../../../../public/data/admin_login.json";
import styles from "./AdminLogin.module.css";
import axios from "axios";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Lấy URL từ biến môi trường

      if (!backendUrl) {
        throw new Error("Backend URL is not configured.");
      }

      const response = await axios.post(
        `${backendUrl}/auth/admin/login`,
        { email: username, password }, // Dữ liệu gửi đi
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token } = response.data; // Lấy token từ response
        localStorage.setItem("token", token); // Lưu token vào localStorage
        localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập
        router.push("/admin/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Nếu lỗi đến từ axios
        const errorMessage =
          error.response?.data?.message || "Invalid username or password.";
        alert(errorMessage + JSON.stringify({ username, password }));
      } else {
        // Lỗi khác
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGif}></div>
      <div className={styles.loginForm}>
        <h2 className={styles.title}>Admin Login</h2>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder=" "
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <span className={styles.inputLabel}>Username</span>
        </div>
        <div className={styles.inputBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <span className={styles.inputLabel}>Password</span>
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button onClick={handleLogin} className={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;

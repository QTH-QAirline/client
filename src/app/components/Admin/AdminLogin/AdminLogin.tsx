"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import adminLoginData from "../../../../../public/data/admin_login.json";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Check login credentials against admin_login.json data
    const adminData = adminLoginData.admin[0];
    if (username === adminData.username && password === adminData.password) {
      // Save login status to localStorage
      localStorage.setItem("isLoggedIn", "true");
      setTimeout(() => {
        router.push("/admin/dashboard"); // Chuyển tới Dashboard
      }, 100);
    } else {
      alert("Invalid username or password.");
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

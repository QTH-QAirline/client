"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./Navigation.module.css";
import Link from "next/link";
import Image from "next/image";
import logoImage from "/public/images/logo.png";
import { en, vi } from "../../utils/locales";
import { useContext } from "react";
import { LanguageContext } from "../../utils/LanguageContext";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, translations } = useContext(LanguageContext);

  const handleLoginClick = () => {
    router.push("/login");
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as "en" | "vi");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Không hiển thị Navigation trong trang login / signup và admin
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <Link href="http://localhost:3000" className={styles.logoLink}>
            <div className={styles.logo}>
              <Image
                src={logoImage}
                alt="QAirline Logo"
                width={30}
                height={30}
                className={styles.logoIcon}
              />
              <span>QAirline</span>
            </div>
          </Link>

          {/* Navigation Links bên cạnh logo */}
          <div className={styles.navLinks}>
            <button
              className={`${styles.navButton} ${
                pathname === "/" ? styles.active : ""
              }`}
              onClick={() => router.push("/")}
            >
              {locale === "en" ? en.navigation.home : vi.navigation.home}
            </button>
            <button
              className={`${styles.navButton} ${
                pathname === "/my-flights" ? styles.active : ""
              }`}
              onClick={() => router.push("/my-flights")}
            >
              {locale === "en"
                ? en.navigation.myFlights
                : vi.navigation.myFlights}
            </button>
          </div>
        </div>

        {/* Desktop Right Menu */}
        <div className={styles.desktopMenu}>
          <select
            className={styles.languageSelect}
            value={locale}
            onChange={handleLanguageChange}
          >
            <option value="en">{en.navigation.language}</option>
            <option value="vi">{vi.navigation.language}</option>
          </select>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            {locale === "en" ? en.navigation.login : vi.navigation.login}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className={styles.menuIcon} />
          ) : (
            <Menu className={styles.menuIcon} />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <select
            className={styles.languageSelect}
            value={locale}
            onChange={handleLanguageChange}
          >
            <option value="en">{en.navigation.language}</option>
            <option value="vi">{vi.navigation.language}</option>
          </select>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            {locale === "en" ? en.navigation.login : vi.navigation.login}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import styles from "./Navigation.module.css";
import Link from "next/link";
import Image from "next/image";
import logoImage from "/public/images/logo.png";
import { en, vi } from "../../utils/locales";
import { LanguageContext } from "../../utils/LanguageContext";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{
    email: string;
    token: string;
  } | null>(null);
  const { locale, setLocale } = useContext(LanguageContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as "en" | "vi");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
          <Link href="/" className={styles.logoLink}>
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

        <div className={styles.desktopMenu}>
          <select
            className={styles.languageSelect}
            value={locale}
            onChange={handleLanguageChange}
          >
            <option value="en">{en.navigation.language}</option>
            <option value="vi">{vi.navigation.language}</option>
          </select>

          {userData ? (
            <div className={styles.userMenu}>
              <button onClick={toggleDropdown} className={styles.avatarButton}>
                <div className={styles.avatar}>
                  {userData.email.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={styles.chevronIcon} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownEmail}>
                    <p>{userData.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    <LogOut className={styles.logoutIcon} />
                    {locale === "en" ? "Logout" : "Đăng xuất"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              {locale === "en" ? en.navigation.login : vi.navigation.login}
            </button>
          )}
        </div>

        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className={styles.menuIcon} />
          ) : (
            <Menu className={styles.menuIcon} />
          )}
        </button>
      </div>

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
          {userData ? (
            <div className={styles.mobileUserMenu}>
              <div className={styles.mobileAvatar}>
                {userData.email.charAt(0).toUpperCase()}
              </div>
              <p className={styles.mobileEmail}>{userData.email}</p>
              <button
                onClick={handleLogout}
                className={styles.mobileLogoutButton}
              >
                <LogOut className={styles.logoutIcon} />
                {locale === "en" ? "Logout" : "Đăng xuất"}
              </button>
            </div>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              {locale === "en" ? en.navigation.login : vi.navigation.login}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;

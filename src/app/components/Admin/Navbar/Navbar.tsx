"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Navbar.module.css";
import logoImage from "/public/images/logo.png";
import {
  Menu,
  Search,
  LogOut,
  Home,
  CalendarCheck,
  Calendar,
  CreditCard,
  TicketsPlane,
  Radar,
  MessageSquare,
  Plane,
  Tag,
  X,
} from "lucide-react";


const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setShowLogout(false); // Đóng menu
    router.push("/admin");
  };
  

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // If pathname is exactly "/admin", do not render Navbar
  if (pathname === "/admin") {
    return null;
  }

  const titles: { [key: string]: string } = {
    "/admin/dashboard": "Dashboard",
    "/admin/bookings": "Bookings",
    "/admin/schedule": "Schedule",
    "/admin/aircraft-management": "Aircraft Management",
    "/admin/flight-tracking": "Flight Tracking",
    "/admin/deals": "Deals",
  };

  const currentTitle = titles[pathname] || "Admin";

  const menuItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
    { href: "/admin/schedule", icon: Calendar, label: "Schedule" },
    {
      href: "/admin/aircraft-management",
      icon: Radar,
      label: "Aircraft Management",
    },
    { href: "/admin/flight-tracking", icon: Plane, label: "Flight Tracking" },
    { href: "/admin/deals", icon: Tag, label: "Deals" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItems = () => {
    return menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;

      return (
        <li
          key={item.href}
          className={`
            ${styles.mobileMenuItem} 
            ${isActive ? styles.active : ""}
          `}
        >
          <Link
            href={item.href}
            className={styles.menuLink}
            onClick={toggleMobileMenu}
          >
            <Icon className={styles.menuIcon} />
            <span className={styles.menuLabel}>{item.label}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <nav className={styles.container}>
      {isMobile && (
        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu size={24} />}
        </div>
      )}

      {/* Page Title */}
      <div className={styles.pageTitle}>{currentTitle}</div>

      {/* Search Container */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>

      {/* User Profile and Logout */}
      <div className={styles.userInfo}>
        <div
          className={styles.userProfile}
          onClick={() => setShowLogout(!showLogout)}
        >
          <img
            src="/images/user.png"
            alt="User Avatar"
            className={styles.avatar}
          />
          <span className={styles.username}>Admin</span>

          {showLogout && (
            <div className={styles.logoutButton} onClick={handleLogout}>
            <div className="flex items-center">
              <LogOut size={16} className="mr-2" />
              Log out
            </div>
          </div>
          
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <aside
          className={`
            ${styles.mobileSidebar} 
            ${styles.mobileMenuOpen}
          `}
        >
          <nav className={styles.mobileNavContainer}>
            <div className={styles.mobileSidebarTitle}>
              <Image
                src={logoImage}
                alt="QAirline Logo"
                width={50}
                height={50}
                className={styles.logoIcon}
              />
              <span className={styles.companyName}>QAirline</span>
            </div>
            <ul className={styles.menu}>{renderMenuItems()}</ul>
          </nav>
        </aside>
      )}
    </nav>
  );
};

export default Navbar;

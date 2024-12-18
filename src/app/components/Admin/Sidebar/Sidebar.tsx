"use client";
import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoImage from "/public/images/logo.png";
import {
  Home,
  CalendarCheck,
  Calendar,
  TicketsPlane,
  Radar,
  CreditCard,
  MessageSquare,
  Plane,
  Tag,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface SidebarProps {
  children?: React.ReactNode;
  onWidthChange?: (width: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ children, onWidthChange }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width <= 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarWidth(0);
        setIsCollapsed(true);
      } else {
        setSidebarWidth(250);
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Notify width change
  useEffect(() => {
    onWidthChange?.(sidebarWidth);
  }, [sidebarWidth, onWidthChange]);

  // Prevent sidebar on specific route
  if (pathname === "/admin" || isMobile) {
    return null;
  }

  // Menu configuration
  const menuItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/bookings", icon: TicketsPlane, label: "Bookings" },
    { href: "/admin/schedule", icon: Calendar, label: "Schedule" },
    {
      href: "/admin/aircraft-management",
      icon: Radar,
      label: "Aircraft Management",
    },
    { href: "/admin/flight-tracking", icon: Plane, label: "Flight Tracking" },
    { href: "/admin/deals", icon: Tag, label: "Deals" },
  ];

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    const newWidth = isCollapsed ? 250 : 80;
    setSidebarWidth(newWidth);
    setIsCollapsed(!isCollapsed);
  };

  // Render menu items
  const renderMenuItems = () => {
    return menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;

      return (
        <li
          key={item.href}
          className={`
            ${styles.menuItem} 
            ${isActive ? styles.active : ""} 
            ${isCollapsed ? styles.collapsedMenuItem : ""}
          `}
        >
          <Link href={item.href} className={styles.menuLink}>
            <Icon className={styles.menuIcon} />
            {!isCollapsed && (
              <span className={styles.menuLabel}>{item.label}</span>
            )}
          </Link>
        </li>
      );
    });
  };

  // Collapse toggle button
  const CollapseToggle = () => (
    <button
      className={`${styles.collapseToggle} ${
        isCollapsed ? styles.collapsed : ""
      }`}
      onClick={toggleSidebarCollapse}
      aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
    >
      {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
    </button>
  );

  // Sidebar style
  const sidebarStyle = {
    width: `${sidebarWidth}px`,
    transition: "width 0.3s ease",
  };

  return (
    <aside
      className={`
        ${styles.container} 
        ${isCollapsed ? styles.collapsed : ""}
      `}
      style={sidebarStyle}
    >
      <nav className={styles.mobileNavContainer}>
        {!isCollapsed && (
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
        )}
        <ul className={styles.menu}>{renderMenuItems()}</ul>
        <CollapseToggle />
      </nav>

      {children}
    </aside>
  );
};

export default Sidebar;

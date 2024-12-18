"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Sidebar from "@/app/components/Admin/Sidebar/Sidebar";
import Navbar from "@/app/components/Admin/Navbar/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  // If the path is exactly '/admin', render only the children
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar onWidthChange={handleSidebarWidthChange} />
      <div
        className={styles.mainContent}
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar />
        <main className={styles.mainSection}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

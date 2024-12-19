import React from "react";
import Deals from "@/app/components/Admin/Deals/Deals";
import styles from "./page.module.css";

const AdminDeals = () => {
  return (
    <div className={styles.container}>
      <Deals />
    </div>
  );
};

export default AdminDeals;

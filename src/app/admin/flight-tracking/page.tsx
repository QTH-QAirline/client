import React from "react";
import FlightTracking from "@/app/components/Admin/FlightTracking/FlightTracking";
import styles from "./page.module.css";

const AdminFlightTracking = () => {
  return (
    <div className={styles.container}>
      <FlightTracking />
    </div>
  );
};

export default AdminFlightTracking;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./page.module.css";
import SeatBooking from "@/app/components/SearchFlights/SeatBooking/SeatBooking";

const SeatManager = () => {
  return (
    <div className={styles.container}>
      <SeatBooking />
    </div>
  );
};

export default SeatManager;

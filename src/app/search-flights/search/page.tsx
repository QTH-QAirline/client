import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./page.module.css";
import FlightInfo from "@/app/components/SearchFlights/FlightInfo/FlightInfo";

const SearchFlight = () => {
  return (
    <div className={styles.container}>
      <FlightInfo />
    </div>
  );
};

export default SearchFlight;

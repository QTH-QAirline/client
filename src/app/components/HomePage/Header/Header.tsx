"use client";
import React, { FormEvent, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeftRight, Calendar, User } from "lucide-react";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

// Utility function to validate and format location input
const formatLocation = (location: string) => {
  return location
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Header = () => {
  const router = useRouter();
  const { locale } = useContext(LanguageContext);

  // Chọn bản dịch dựa trên ngôn ngữ hiện tại
  const translations = locale === "en" ? en.header : vi.header;

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [travelers, setTravelers] = useState(
    translations.travelerLabels.onePerson
  );
  const [tripType, setTripType] = useState("oneWay");
  const [ticketClass, setTicketClass] = useState("business");

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange({
      startDate: start || undefined,
      endDate: end || undefined,
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const formattedFromLocation = formatLocation(fromLocation);
    const formattedToLocation = formatLocation(toLocation);

    if (!formattedFromLocation || !formattedToLocation) {
      alert(
        locale === "en"
          ? "Please enter both departure and arrival locations"
          : "Vui lòng nhập điểm đi và điểm đến"
      );
      return;
    }

    if (formattedFromLocation === formattedToLocation) {
      alert(
        locale === "en"
          ? "Departure and arrival locations cannot be the same"
          : "Điểm đi và điểm đến không được trùng nhau"
      );
      return;
    }

    // Chuẩn bị thông tin chi tiết để gửi đi
    const queryParams = new URLSearchParams({
      fromLocation: formattedFromLocation,
      toLocation: formattedToLocation,
      startDate: dateRange.startDate?.toISOString() || "",
      endDate: dateRange.endDate?.toISOString() || "",
      travelers,
      tripType,
      ticketClass,
    }).toString();

    router.push(`/search-flights/search?${queryParams}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.mainInputs}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{translations.fromLabel}</label>
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className={styles.input}
                  placeholder={translations.fromInput}
                  required
                />
              </div>

              <button
                type="button"
                onClick={swapLocations}
                className={styles.swapButton}
              >
                <ArrowLeftRight className={styles.swapIcon} />
              </button>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{translations.toLabel}</label>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className={styles.input}
                  placeholder={translations.toInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{translations.dateLabel}</label>
                <div className={styles.iconInput}>
                  <Calendar className={styles.inputIcon} />
                  <DatePicker
                    selectsRange={true}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={handleDateChange}
                    placeholderText={translations.dateInput}
                    dateFormat="dd/MM/yyyy"
                    className={`${styles.input} ${styles.datepickerInput}`}
                    isClearable={false}
                    minDate={new Date()}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  {translations.travelerLabel}
                </label>
                <div className={styles.iconInput}>
                  <User className={styles.inputIcon} />
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className={styles.select}
                  >
                    <option value={translations.travelerLabels.onePerson}>
                      {translations.travelerLabels.onePerson}
                    </option>
                    <option value={translations.travelerLabels.twoPersons}>
                      {translations.travelerLabels.twoPersons}
                    </option>
                    <option value={translations.travelerLabels.threePersons}>
                      {translations.travelerLabels.threePersons}
                    </option>
                    <option value={translations.travelerLabels.multiPerson}>
                      {translations.travelerLabels.multiPerson}
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={styles.searchButton}
                onClick={handleSearch}
              >
                <b>{translations.searchButton}</b>
              </button>
            </div>

            <div className={styles.optionsRow}>
              <div className={styles.tripTypeSelector}>
                {Object.entries(translations.tripTypeLabels).map(
                  ([key, label]) => (
                    <label key={key} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="tripType"
                        value={key}
                        checked={tripType === key}
                        onChange={(e) => setTripType(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>{label}</span>
                    </label>
                  )
                )}
              </div>

              <div className={styles.ticketClassSelector}>
                {Object.entries(translations.ticketClassLabels).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.classButton} ${
                        ticketClass === key ? styles.activeClass : ""
                      }`}
                      onClick={() => setTicketClass(key)}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;

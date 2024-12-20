"use client";
import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";
import styles from "./BookingConfirmation.module.css";

interface FlightDetails {
  stops: number;
  totalDuration: string;
  departure: {
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airportCode: string;
    city: string;
    time: string;
    date: string;
  };
  flights: {
    airline: string;
    flightNumber: string;
  }[];
  pricing: {
    [key: string]: {
      price: number;
      currency: string;
    };
  };
}

interface BookingDetails {
  flightDetails: FlightDetails;
  selectedClass: string;
  selectedSeat: string;
}

const BookingConfirmation: React.FC = () => {
  //Dịch
  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.bookingConfirm : vi.bookingConfirm;

  const router = useRouter();
  const searchParams = useSearchParams();

  // State cho thông tin khách hàng
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Quốc tịch
  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Belgium", label: "Belgium" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Brazil", label: "Brazil" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Canada", label: "Canada" },
    { value: "China", label: "China" },
    { value: "Denmark", label: "Denmark" },
    { value: "Egypt", label: "Egypt" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "Greece", label: "Greece" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Italy", label: "Italy" },
    { value: "Japan", label: "Japan" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Mexico", label: "Mexico" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Norway", label: "Norway" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Russia", label: "Russia" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Singapore", label: "Singapore" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Korea", label: "South Korea" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Thailand", label: "Thailand" },
    { value: "Turkey", label: "Turkey" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    // Thêm tất cả các quốc tịch khác
  ].sort((a, b) => a.label.localeCompare(b.label)); // Sắp xếp theo bảng chữ cái

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  // State to manage the visibility of the success notification
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    try {
      const bookingData = searchParams.get("bookingDetails");
      if (bookingData) {
        const parsedData = JSON.parse(bookingData);
        setBookingDetails(parsedData);
      }
    } catch (error) {
      console.error("Lỗi khi parse dữ liệu booking:", error);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const completeBookingData = {
      passengerDetails: {
        fullName,
        dateOfBirth,
        idNumber,
        nationality,
        email,
        phoneNumber,
      },
      flightDetails: bookingDetails?.flightDetails,
      selectedClass: bookingDetails?.selectedClass,
      selectedSeat: bookingDetails?.selectedSeat,
      bookingTime: new Date().toISOString(),
    };

    console.log("Complete Booking Data:", completeBookingData);
    // alert("Đặt vé thành công!");

    // Show success notification
    setShowSuccessNotification(true);
  };

  const handleNotificationClose = () => {
    setShowSuccessNotification(false);
  };

  if (!bookingDetails) return <div>{translations.loading}</div>;

  const { flightDetails, selectedClass, selectedSeat } = bookingDetails;
  const price = flightDetails.pricing[selectedClass];

  return (
    <div className={styles.bookingContainer}>
      <h1>{translations.confirm_booking}</h1>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className={styles.notificationOverlay}>
          <div className={styles.notificationBox}>
            <div className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={styles.checkIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className={styles.message}>{translations.success_message}</p>
            <button
              onClick={handleNotificationClose}
              className={styles.okButton}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className={styles.flightSummary}>
        <h2 className={styles.summaryTitle}>{translations.flight_details}</h2>

        {/* Flight Header */}
        <div className={styles.flightHeader}>
          <span className={styles.airline}>
            {flightDetails.flights[0].airline} -{" "}
            {flightDetails.flights[0].flightNumber}
          </span>
        </div>

        {/* Flight Route */}
        <div className={styles.flightRoute}>
          <div className={styles.departure}>
            <p className={styles.label}>{translations.departure_city}</p>
            <p className={styles.city}>{flightDetails.departure.city}</p>
            <p className={styles.airport}>
              ({flightDetails.departure.airportCode})
            </p>
            <p className={styles.time}>
              {flightDetails.departure.time}, {flightDetails.departure.date}
            </p>
          </div>

          <div className={styles.flightInfo}>
            <p className={styles.duration}>{flightDetails.totalDuration}</p>
            <div className={styles.flightLine}>
              <div className={styles.stops}>{flightDetails.stops} stops</div>
            </div>
          </div>

          <div className={styles.arrival}>
            <p className={styles.label}>{translations.arrival_city}</p>
            <p className={styles.city}>{flightDetails.arrival.city}</p>
            <p className={styles.airport}>
              ({flightDetails.arrival.airportCode})
            </p>
            <p className={styles.time}>
              {flightDetails.arrival.time}, {flightDetails.arrival.date}
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className={styles.ticketDetails}>
          <div className={styles.ticketInfo}>
            <span className={styles.label}>{translations.ticket_class}</span>
            <span className={styles.value}>{selectedClass}</span>
          </div>
          <div className={styles.ticketInfo}>
            <span className={styles.label}>{translations.selected_seat}</span>
            <span className={styles.value}>{selectedSeat}</span>
          </div>
        </div>

        {/* Price */}
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>{translations.price}</span>
          <span className={styles.priceValue}>
            {price.price.toLocaleString()} {price.currency}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <div className={styles.formGroup}>
          <label>{translations.full_name}</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{translations.date_of_birth}</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{translations.id_number}</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{translations.nationality}</label>
          <Select
            options={countries}
            value={countries.find((c) => c.value === nationality)}
            onChange={(selectedOption) =>
              setNationality(selectedOption?.value || "")
            }
            // placeholder="Chọn quốc tịch"
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#ccc",
                boxShadow: "none",
                "&:hover": { borderColor: "#aaa" },
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: "200px",
              }),
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>{translations.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{translations.phone_number}</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {translations.submit_booking}
        </button>
      </form>
    </div>
  );
};

export default BookingConfirmation;

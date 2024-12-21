"use client";
import { useState, useEffect, useContext } from "react";
import styles from "./page.module.css";
import { LanguageContext } from "../utils/LanguageContext";
import { en, vi } from "../utils/locales";
import axios from "axios";

type FlightStatus = "upcoming" | "completed" | "cancelled";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Airport {
  city: string;
  airport: string;
  code: string;
  terminal: string;
}

interface Flight {
  id: string;
  from: Airport;
  to: Airport;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  status: string;
  price: number;
  class: string;
  bookingCode: string;
  cancellationReason?: string;
}

interface FlightData {
  flights: {
    upcoming: Flight[];
    completed: Flight[];
    cancelled: Flight[];
  };
}

export default function MyFlights() {
  const [activeTab, setActiveTab] = useState<FlightStatus>("upcoming");
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);

  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.myFlights : vi.myFlights;

  const tabs: FlightStatus[] = ["upcoming", "completed", "cancelled"];

  // Translations for specific terms
  const translateAirport = (airport: string) => {
    if (locale === "vi") {
      const words = airport.split(" ");
      if (
        words.length >= 2 &&
        words.slice(-2).join(" ") === "International Airport"
      ) {
        const cityName = words.slice(0, -2).join(" ");
        return `Sân Bay Quốc Tế ${cityName}`;
      }
      return airport;
    }
    return airport;
  };

  const translateFlightClass = (flightClass: string) => {
    if (locale === "vi") {
      switch (flightClass) {
        case "Economy":
          return "Hạng Phổ thông";
        case "Business":
          return "Hạng Thương gia";
        case "First Class":
          return "Hạng Nhất";
        default:
          return flightClass;
      }
    }
    return flightClass;
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const storedUserData = localStorage.getItem("user");
        let userData;
        // Kiểm tra xem dữ liệu có tồn tại hay không
        if (storedUserData) {
          // Chuyển đổi chuỗi JSON thành đối tượng
          userData = JSON.parse(storedUserData);
        } else {
          console.log("Không có dữ liệu người dùng trong localStorage");
        }
        const response = await axios.get(
          `${BACKEND_URL}/customers/tickets/${userData.customer_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.token}`, // Thay `token` bằng token thực tế của bạn
            },
          }
        );
        const data = response.data;
        
        console.log(data);
        setFlightData(data);
      } catch (error) {
        console.error("Error loading flight data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "en" ? "en-US" : "vi-VN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderFlightCard = (flight: Flight) => {
    return (
      <div key={flight.id} className={styles.flightCard}>
        <div className={styles.flightHeader}>
          <div className={styles.airline}>
            <span className={styles.airlineName}>{flight.airline}</span>
            <span className={styles.flightNumber}>#{flight.flightNumber}</span>
          </div>
          <div className={styles.bookingCode}>
            {translations.bookingCode}: <span>{flight.bookingCode}</span>
          </div>
        </div>

        <div className={styles.flightRoute}>
          <div className={styles.departure}>
            <div className={styles.city}>{flight.from.city}</div>
            <div className={styles.time}>{flight.departureTime}</div>
            <div className={styles.date}>
              {formatDate(flight.departureDate)}
            </div>
            <div className={styles.airport}>
              {translateAirport(flight.from.airport)}
            </div>
            <div className={styles.terminal}>
              {translations.terminal} {flight.from.terminal}
            </div>
          </div>

          <div className={styles.flightInfo}>
            <div className={styles.aircraft}>{flight.aircraft}</div>
            <div className={styles.class}>
              {translateFlightClass(flight.class)}
            </div>
          </div>

          <div className={styles.arrival}>
            <div className={styles.city}>{flight.to.city}</div>
            <div className={styles.time}>{flight.arrivalTime}</div>
            <div className={styles.date}>{formatDate(flight.arrivalDate)}</div>
            <div className={styles.airport}>
              {translateAirport(flight.to.airport)}
            </div>
            <div className={styles.terminal}>
              {translations.terminal} {flight.to.terminal}
            </div>
          </div>
        </div>

        <div className={styles.flightFooter}>
          <div className={styles.status}>
            {translations.status}: <span>{flight.status}</span>
            {flight.cancellationReason && (
              <span className={styles.cancellationReason}>
                ({flight.cancellationReason})
              </span>
            )}
          </div>
          <div className={styles.price}>{formatPrice(flight.price)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>{translations.content}</h1>
        <div className={styles.flightsTabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {translations.tabs[tab]}
            </button>
          ))}
        </div>

        <div className={styles.flightsContainer}>
  {loading ? (
    <div className={styles.loading}>{translations.loading}</div>
  ) : flightData?.flights?.[activeTab] ? (
    // Kiểm tra flightData.flights[activeTab] tồn tại và có chuyến bay
    <div className={styles.flightsList}>
      {flightData.flights[activeTab].map((flight) =>
        renderFlightCard(flight),
      )}
    </div>
  ) : flightData ? (
    // Nếu flightData có nhưng không có chuyến bay cho activeTab
    <div className={styles.noFlights}>
      {translations.noFlights.replace("{status}", activeTab)}
    </div>
  ) : (
    // Nếu không có flightData
    <div className={styles.error}>{translations.error}</div>
  )}
</div>

      </div>
    </div>
  );
}

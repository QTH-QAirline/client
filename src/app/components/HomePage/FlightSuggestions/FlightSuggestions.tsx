"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import styles from "./FlightSuggestions.module.css";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

interface FlightData {
  base_price: string;
  airports_flights_arrival_airportToairports: {
    location: string;
    country: string;
  };
  promotions: any[];
}

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  startDate: string;
  endDate: string;
  type: string;
  price: number;
  currency: string;
}

// Type guard để kiểm tra cấu trúc của FlightData
const isFlightData = (item: any): item is FlightData => {
  return (
    item &&
    typeof item.base_price === "string" &&
    item.airports_flights_arrival_airportToairports &&
    typeof item.airports_flights_arrival_airportToairports.location ===
      "string" &&
    typeof item.airports_flights_arrival_airportToairports.country ===
      "string" &&
    Array.isArray(item.promotions)
  );
};

const INITIAL_VISIBLE_COUNT = 5;

const FlightSuggestions = () => {
  const { locale } = useContext(LanguageContext);
  const translations =
    locale === "en" ? en.flightSuggestions : vi.flightSuggestions;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [visibleDestinations, setVisibleDestinations] = useState<number>(
    INITIAL_VISIBLE_COUNT
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("HAN");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const fetchDestinations = async (from: string) => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const response = await fetch("http://localhost:4000/customers/flights", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          date: new Date().toISOString(),
        }),
      });

      // Đọc response dưới dạng text trước
      const responseText = await response.text();

      let data;
      try {
        // Thử parse JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        // Nếu không parse được JSON, coi như đó là message text
        setMessage(responseText);
        setDestinations([]);
        return;
      }

      // Kiểm tra nếu data là mảng rỗng
      if (Array.isArray(data) && data.length === 0) {
        setMessage("Không tìm thấy chuyến bay nào");
        setDestinations([]);
        return;
      }

      // Kiểm tra nếu data không phải là mảng
      if (!Array.isArray(data)) {
        setMessage(typeof data === "string" ? data : "Dữ liệu không hợp lệ");
        setDestinations([]);
        return;
      }

      // Kiểm tra cấu trúc của từng item trong mảng
      if (!data.every(isFlightData)) {
        setMessage("Dữ liệu chuyến bay không đúng định dạng");
        setDestinations([]);
        return;
      }

      // Xử lý dữ liệu sau khi đã kiểm tra type
      const mappedDestinations = (data as FlightData[]).map(
        (item: FlightData, index: number) => ({
          id: index,
          name: item.airports_flights_arrival_airportToairports.location,
          country: item.airports_flights_arrival_airportToairports.country,
          image: `/images/flight-suggestions/${index + 1}.jpeg`,
          startDate: new Date().toLocaleDateString(locale),
          endDate: new Date().toLocaleDateString(locale),
          type: "Direct",
          price: parseFloat(item.base_price),
          currency: "USD",
        })
      );

      setDestinations(mappedDestinations);
    } catch (error) {
      console.error("Error loading destinations:", error);
      setMessage("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  useEffect(() => {
    fetchDestinations(searchValue);
  }, [locale]);

  const handleSearch = () => {
    fetchDestinations(searchValue);
  };

  const handleViewMore = () => {
    setVisibleDestinations((prev) => Math.min(prev + 5, destinations.length));
  };

  const handleShowLess = () => {
    setVisibleDestinations(INITIAL_VISIBLE_COUNT);
    const container = document.getElementById("destinationContainer");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.search}>
          <h2 className={styles.title}>{translations.title}</h2>
          <p className={styles.subtitle}>{translations.subtitle}</p>
          <div className={styles.inputContainer}>
            <span className={styles.fromLabel}>{translations.fromInput}</span>
            <input
              type="text"
              className={styles.fromInput}
              placeholder={translations.fromLabel}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              {translations.searchButton}
            </button>
          </div>
        </div>
      </div>

      <div id="destinationContainer" className={styles.destinationContainer}>
        {message ? (
          <div className={isError ? styles.error : styles.noResults}>
            {message}
          </div>
        ) : destinations.length > 0 ? (
          <>
            <div className={styles.destination}>
              {destinations.slice(0, visibleDestinations).map((dest, index) => (
                <div
                  key={dest.id}
                  className={`${styles.destinationCard} ${
                    styles[`des${index + 1}`]
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.overlay}>
                    <h3>{dest.name}</h3>
                    <p className={styles.location}>{dest.country}</p>
                    <p className={styles.date}>
                      {dest.startDate} - {dest.endDate}
                    </p>
                    <div className={styles.priceTag}>
                      <span className={styles.type}>{dest.type}</span>
                      <span className={styles.price}>
                        {translations.priceFrom} {dest.price} {dest.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.buttonContainer}>
              {visibleDestinations < destinations.length ? (
                <button
                  className={styles.customButton}
                  onClick={handleViewMore}
                >
                  {translations.moreButton}
                </button>
              ) : (
                visibleDestinations > INITIAL_VISIBLE_COUNT && (
                  <button
                    className={`${styles.customButton} ${styles.showLessButton}`}
                    onClick={handleShowLess}
                  >
                    {translations.lessButton}
                  </button>
                )
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FlightSuggestions;

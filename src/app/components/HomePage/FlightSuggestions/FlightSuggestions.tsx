"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import styles from "./FlightSuggestions.module.css";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

interface Destination {
  id: number;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  type: string;
  price: number;
  currency: string;
}

interface FlightData {
  destinations: Destination[];
}

const INITIAL_VISIBLE_COUNT = 5;

const FlightSuggestions = () => {
  const { locale } = useContext(LanguageContext);
  // Chọn bản dịch dựa trên ngôn ngữ hiện tại
  const translations =
    locale === "en" ? en.flightSuggestions : vi.flightSuggestions;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [visibleDestinations, setVisibleDestinations] = useState<number>(
    INITIAL_VISIBLE_COUNT
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          `/data/flightsuggestions/flightsuggestions_${locale}.json`
        );
        const data: FlightData = await response.json();
        setDestinations(data.destinations);
        setLoading(false);
      } catch (error) {
        console.error("Error loading destinations:", error);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [locale]);

  const handleViewMore = () => {
    setVisibleDestinations((prev) => Math.min(prev + 5, destinations.length));
  };

  const handleShowLess = () => {
    setVisibleDestinations(INITIAL_VISIBLE_COUNT);
    // Scroll back to top of destination container smoothly
    const container = document.getElementById("destinationContainer");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
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
              defaultValue="Dhaka DAC"
            />
          </div>
        </div>
      </div>
      <div id="destinationContainer" className={styles.destinationContainer}>
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
                <p className={styles.date}>
                  {dest.startDate} - {dest.endDate}
                </p>
                <div className={styles.priceTag}>
                  <span className={styles.type}>{dest.type}</span>
                  <span className={styles.price}>
                    {translations.priceFrom} {dest.price}
                    {dest.currency}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          {visibleDestinations < destinations.length ? (
            <button className={styles.customButton} onClick={handleViewMore}>
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
      </div>
    </div>
  );
};

export default FlightSuggestions;

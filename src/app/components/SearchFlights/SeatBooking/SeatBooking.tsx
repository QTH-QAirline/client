"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";
import styles from "./SeatBooking.module.css";

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

interface SeatMap {
  row: string;
  seats: {
    id: string;
    status: "available" | "occupied" | "selected";
  }[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVW".split("");

const SeatBooking: React.FC = () => {
  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.seatBooking : vi.seatBooking;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMap[]>([]);

  useEffect(() => {
    const generateSeatMap = () => {
      const rows: SeatMap[] = [];

      switch (selectedClass) {
        case "economy": {
          // Generate rows A-W with 6 seats each (3-3 configuration)
          ALPHABET.forEach((rowLetter) => {
            const row: SeatMap = {
              row: rowLetter,
              seats: [
                // First group of 3 seats
                ...[1, 2, 3].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
                // Aisle space
                { id: "space", status: "occupied" as const },
                // Second group of 3 seats
                ...[4, 5, 6].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
              ],
            };
            rows.push(row);
          });
          break;
        }
        case "business": {
          // Generate rows A-F with 4 seats each (2-2 configuration)
          ALPHABET.slice(0, 6).forEach((rowLetter) => {
            const row: SeatMap = {
              row: rowLetter,
              seats: [
                // First pair of seats
                ...[1].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
                // Aisle space
                { id: "space", status: "occupied" as const },
                { id: "space", status: "occupied" as const },
                // Second pair of seats
                ...[2].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
                // Aisle space
                { id: "space", status: "occupied" as const },
                { id: "space", status: "occupied" as const },
                // Third pair of seats
                ...[3].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
              ],
            };
            rows.push(row);
          });
          break;
        }
        case "firstClass": {
          // Generate rows A-C with 3 seats each (single row configuration)
          ALPHABET.slice(0, 3).forEach((rowLetter) => {
            const row: SeatMap = {
              row: rowLetter,
              seats: [
                // First pair of seats
                ...[1].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
                // Aisle space
                { id: "space", status: "occupied" as const },
                { id: "space", status: "occupied" as const },
                // Second pair of seats
                ...[2].map((num) => ({
                  id: `${rowLetter}${num}`,
                  status:
                    Math.random() > 0.3
                      ? ("available" as const)
                      : ("occupied" as const),
                })),
              ],
            };
            rows.push(row);
          });
          break;
        }
      }
      setSeatMap(rows);
    };

    if (selectedClass) {
      generateSeatMap();
    }
  }, [selectedClass]);

  useEffect(() => {
    const flightData = searchParams.get("flightDetails");
    const selectedClassData = searchParams.get("selectedClass");

    if (flightData) {
      setFlightDetails(JSON.parse(flightData));
    }
    if (selectedClassData) {
      setSelectedClass(selectedClassData);
    }
  }, [searchParams]);

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleConfirmation = () => {
    if (!selectedSeat || !flightDetails) return;

    const bookingData = {
      flightDetails,
      selectedClass,
      selectedSeat,
    };

    const params = new URLSearchParams({
      bookingDetails: JSON.stringify(bookingData),
    });

    router.push(`/search-flights/booking-confirmation?${params.toString()}`);
  };

  if (!flightDetails || !selectedClass) {
    return <div>{translations.loading}</div>;
  }

  return (
    <div className={styles.seatBookingContainer}>
      <div className={styles.flightSummary}>
        {/* Flight Route */}
        <div className={styles.flightRoute}>
          <div className={styles.flightSelected}>
            <h2>{translations.flightSummary}</h2>
          </div>

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
      </div>

      <div className={styles.seatMap}>
        <h3>{translations.selectSeat}</h3>
        <div className={styles.seatGrid}>
          {seatMap.map((row) => (
            <div key={row.row} className={styles.row}>
              <span className={styles.rowNumber}>{row.row}</span>
              <div className={styles.seats}>
                {row.seats.map((seat, index) =>
                  seat.id === "space" ? (
                    <div
                      key={`${row.row}-space-${index}`}
                      className={styles.space}
                    />
                  ) : (
                    <button
                      key={seat.id}
                      className={`${styles.seat} ${styles[seat.status]} ${
                        selectedSeat === seat.id ? styles.selected : ""
                      }`}
                      onClick={() =>
                        seat.status === "available" &&
                        handleSeatSelection(seat.id)
                      }
                      disabled={seat.status === "occupied"}
                    >
                      {seat.id}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.available}`} />
          <span>{translations.available}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.occupied}`} />
          <span>{translations.occupied}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.selected}`} />
          <span>{translations.selected}</span>
        </div>
      </div>

      <button
        className={styles.confirmButton}
        onClick={handleConfirmation}
        disabled={!selectedSeat}
      >
        {translations.confirm}
      </button>
    </div>
  );
};

export default SeatBooking;

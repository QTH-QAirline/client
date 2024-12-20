"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation"; // Import router
import styles from "./FlightInfo.module.css";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";
import { text } from "stream/consumers";

// Flight Data Interface
interface FlightData {
  stops: number;
  totalDuration: string;
  departure: {
    airportCode: string;
    city: string;
    time: string;
    terminal: string;
    date: string;
    dayOfWeek: string;
  };
  arrival: {
    airportCode: string;
    city: string;
    time: string;
    terminal: string;
    date: string;
    dayOfWeek: string;
  };
  flights: {
    airline: string;
    flightNumber: string;
    operatedBy: string;
  }[];
  pricing: {
    economy: {
      availability: string;
      price: {
        currency: string;
        amount: number;
        perPerson: boolean;
      };
    };
    business: {
      availability: string;
      price: {
        currency: string;
        amount: number;
        perPerson: boolean;
      };
    };
    firstClass: {
      availability: string;
      price: {
        currency: string;
        amount: number;
        perPerson: boolean;
      };
    };
  };
}

// Main FlightInfo Component
const FlightInfo: React.FC = () => {
  // Language and Translation Setup
  const { locale } = useContext(LanguageContext);
  const translations = locale === "en" ? en.flightInfo : vi.flightInfo;

  const router = useRouter(); // Khởi tạo router

  // Translation Utility Function
  const translateFlightClass = (flightClass: string) => {
    switch (flightClass) {
      case "Economy":
        return translations.flightClasses.Economy;
      case "Business":
        return translations.flightClasses.Business;
      case "First Class":
        return translations.flightClasses.FirstClass;
      default:
        return flightClass;
    }
  };

  // State Management
  const [selectedSort, setSelectedSort] = useState<"price" | "duration">(
    "price"
  );
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<{
    [key: number]: "economy" | "business" | "firstClass";
  }>({});

  // Hàm mới để reset trạng thái khi chọn container khác
  const resetFlightSelection = (newIndex: number) => {
    // Nếu người dùng chọn một container mới khác với container đang được chọn
    if (selectedFlight !== newIndex) {
      // Reset trạng thái về mặc định
      setSelectedFlight(null);
      setSelectedClasses({});
    }
  };

  // Mock Flight Data (In a real app, this would come from an API)
  const flightData = {
    searchResults: [
      {
        stops: 0,
        totalDuration: "2h 10m",
        departure: {
          airportCode: "HAN",
          city: "Hanoi",
          time: "06:30",
          terminal: "Terminal 1",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        arrival: {
          airportCode: "SGN",
          city: "Ho Chi Minh City",
          time: "08:40",
          terminal: "Terminal 2",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        flights: [
          {
            airline: "QAirline",
            flightNumber: "VN 221",
            operatedBy: "QAirline",
          },
        ],
        pricing: {
          economy: {
            availability: "Multiple seats",
            price: {
              currency: "VND",
              amount: 1850000,
              perPerson: true,
            },
          },
          business: {
            availability: "3 seats left",
            price: {
              currency: "VND",
              amount: 6200000,
              perPerson: true,
            },
          },
          firstClass: {
            availability: "2 seats left",
            price: {
              currency: "VND",
              amount: 12500000,
              perPerson: true,
            },
          },
        },
      },
      {
        stops: 1,
        totalDuration: "4h 15m",
        departure: {
          airportCode: "DAD",
          city: "Da Nang",
          time: "10:45",
          terminal: "Terminal 2",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        arrival: {
          airportCode: "SGN",
          city: "Ho Chi Minh City",
          time: "15:00",
          terminal: "Terminal 3",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        flights: [
          {
            airline: "QAirline",
            flightNumber: "QH 1452",
            operatedBy: "QAirline",
          },
        ],
        pricing: {
          economy: {
            availability: "Multiple seats",
            price: {
              currency: "VND",
              amount: 2350000,
              perPerson: true,
            },
          },
          business: {
            availability: "1 seat left",
            price: {
              currency: "VND",
              amount: 7800000,
              perPerson: true,
            },
          },
          firstClass: {
            availability: "Not available",
            price: {
              currency: "VND",
              amount: 0,
              perPerson: true,
            },
          },
        },
      },
      {
        stops: 2,
        totalDuration: "6h 30m",
        departure: {
          airportCode: "HPH",
          city: "Hai Phong",
          time: "13:20",
          terminal: "Terminal 1",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        arrival: {
          airportCode: "SGN",
          city: "Ho Chi Minh City",
          time: "19:50",
          terminal: "Terminal 2",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        flights: [
          {
            airline: "QAirline",
            flightNumber: "VJ 876",
            operatedBy: "QAirline",
          },
        ],
        pricing: {
          economy: {
            availability: "Not available",
            price: {
              currency: "VND",
              amount: 0,
              perPerson: true,
            },
          },
          business: {
            availability: "Not available",
            price: {
              currency: "VND",
              amount: 0,
              perPerson: true,
            },
          },
          firstClass: {
            availability: "Not available",
            price: {
              currency: "VND",
              amount: 0,
              perPerson: true,
            },
          },
        },
      },
      {
        stops: 0,
        totalDuration: "1h 50m",
        departure: {
          airportCode: "HAN",
          city: "Hanoi",
          time: "16:15",
          terminal: "Terminal 2",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        arrival: {
          airportCode: "SGN",
          city: "Ho Chi Minh City",
          time: "18:05",
          terminal: "Terminal 1",
          date: "2024-07-15",
          dayOfWeek: "Monday",
        },
        flights: [
          {
            airline: "QAirline",
            flightNumber: "BL 318",
            operatedBy: "QAirline",
          },
        ],
        pricing: {
          economy: {
            availability: "Multiple seats",
            price: {
              currency: "VND",
              amount: 1750000,
              perPerson: true,
            },
          },
          business: {
            availability: "4 seats left",
            price: {
              currency: "VND",
              amount: 5900000,
              perPerson: true,
            },
          },
          firstClass: {
            availability: "1 seat left",
            price: {
              currency: "VND",
              amount: 11200000,
              perPerson: true,
            },
          },
        },
      },
    ],
  };

  // Single Flight Information Component
  const SingleFlightInfo: React.FC<
    FlightData & {
      index: number;
      isSelected: boolean;
      onSelect: (index: number) => void;
      onReset: (index: number) => void;
    }
  > = ({
    index,
    isSelected,
    onSelect,
    onReset,
    stops,
    totalDuration,
    departure,
    arrival,
    flights,
    pricing,
  }) => {
    const handleBookingProcess = (e: React.MouseEvent) => {
      e.stopPropagation();
      const selectedFlightData = flightData.searchResults[index];

      // Chuyển dữ liệu qua URL params
      const params = new URLSearchParams({
        flightDetails: JSON.stringify(selectedFlightData),
        selectedClass: selectedClass || "",
      });

      router.push(`/search-flights/seat-booking?${params.toString()}`);
    };
    // Handle Class Selection
    const handleClassChange = (
      classType: "economy" | "business" | "firstClass"
    ) => {
      // Reset nếu chọn container mới
      onReset(index);

      setSelectedClasses((prev) => ({ ...prev, [index]: classType }));
      onSelect(index);
    };

    const selectedClass = selectedClasses[index];
    const canProcessBooking =
      selectedClass &&
      ((selectedClass === "economy" && pricing.economy.price?.amount) ||
        (selectedClass === "business" && pricing.business.price?.amount) ||
        (selectedClass === "firstClass" && pricing.firstClass.price?.amount));

    // Localize Availability Text
    const localizeAvailability = (
      availability: string,
      fallbackText: string
    ) => {
      if (availability === "Multiple seats")
        return translations.flightSearch.pricing.multipleSeats;
      if (availability === "Not available")
        return translations.flightSearch.pricing.notAvailable;
      if (availability.includes("seat left")) {
        const seatCount = availability.split(" ")[0];
        return `${seatCount} ${translations.flightSearch.pricing.seatLeft}`;
      }
      return availability || fallbackText;
    };

    return (
      <div
        className={`${styles.container} ${
          isSelected ? styles.selectedFlight : ""
        }`}
        onClick={() => {
          onReset(index); // Gọi hàm reset khi click vào container
          onSelect(index);
        }}
      >
        <div className={styles.details}>
          <div className={styles.departure}>
            <div className={styles.time}>{departure.time}</div>
            <div className={styles.location}>
              <div className={styles.airport}>{departure.airportCode}</div>
              <div className={styles.city}>{departure.city}</div>
            </div>
          </div>
          <div className={styles.duration}>
            <span className={styles.stops}>
              {stops}{" "}
              {stops === 1
                ? translations.flightSearch.stops.one
                : translations.flightSearch.stops.zero}
            </span>
            <span className={styles.time}>{totalDuration}</span>
          </div>
          <div className={styles.arrival}>
            <div className={styles.time}>{arrival.time}</div>
            <div className={styles.location}>
              <div className={styles.airport}>{arrival.airportCode}</div>
              <div className={styles.city}>{arrival.city}</div>
            </div>
          </div>
        </div>
        <div className={styles.airline}>
          <div className={styles.name}>{flights[0].airline}</div>
          <div className={styles.number}>{flights[0].flightNumber}</div>
        </div>
        <div className={styles.pricing}>
          {/* Economy Class */}
          <div
            className={`${styles.class} ${
              selectedClass === "economy" ? styles.selectedClass : ""
            }`}
          >
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name={`class-${index}`}
                value="economy"
                checked={selectedClass === "economy"}
                onChange={() => handleClassChange("economy")}
                disabled={!pricing.economy.price?.amount}
              />
              <span>{translateFlightClass("Economy")}</span>
            </label>
            <div className={styles.availability}>
              {localizeAvailability(
                pricing.economy.availability,
                translations.flightSearch.pricing.notAvailable
              )}
            </div>
            {pricing.economy.price?.amount > 0 ? (
              <div className={styles.price}>
                {pricing.economy.price.amount.toLocaleString()}{" "}
                {pricing.economy.price.currency}
              </div>
            ) : (
              <div className={styles.unavailable}>
                {translations.flightSearch.pricing.notAvailable}
              </div>
            )}
          </div>

          {/* Business Class */}
          <div
            className={`${styles.class} ${
              selectedClass === "business" ? styles.selectedClass : ""
            }`}
          >
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name={`class-${index}`}
                value="business"
                checked={selectedClass === "business"}
                onChange={() => handleClassChange("business")}
                disabled={!pricing.business.price?.amount}
              />
              <span>{translateFlightClass("Business")}</span>
            </label>
            <div className={styles.availability}>
              {localizeAvailability(
                pricing.business.availability,
                translations.flightSearch.pricing.notAvailable
              )}
            </div>
            {pricing.business.price?.amount > 0 ? (
              <div className={styles.price}>
                {pricing.business.price.amount.toLocaleString()}{" "}
                {pricing.business.price.currency}
              </div>
            ) : (
              <div className={styles.unavailable}>
                {translations.flightSearch.pricing.notAvailable}
              </div>
            )}
          </div>

          {/* First Class */}
          <div
            className={`${styles.class} ${
              selectedClass === "firstClass" ? styles.selectedClass : ""
            }`}
          >
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name={`class-${index}`}
                value="firstClass"
                checked={selectedClass === "firstClass"}
                onChange={() => handleClassChange("firstClass")}
                disabled={!pricing.firstClass.price?.amount}
              />
              <span>{translateFlightClass("First Class")}</span>
            </label>
            <div className={styles.availability}>
              {localizeAvailability(
                pricing.firstClass.availability,
                translations.flightSearch.pricing.notAvailable
              )}
            </div>
            {pricing.firstClass.price?.amount > 0 ? (
              <div className={styles.price}>
                {pricing.firstClass.price.amount.toLocaleString()}{" "}
                {pricing.firstClass.price.currency}
              </div>
            ) : (
              <div className={styles.unavailable}>
                {translations.flightSearch.pricing.notAvailable}
              </div>
            )}
          </div>
        </div>

        {/* Booking Actions */}
        {isSelected && canProcessBooking && (
          <div className={styles.bookingActions}>
            <button
              className={styles.processButton}
              onClick={handleBookingProcess}
            >
              {translations.flightSearch.bookingButton}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Flight Sorting Utility
  const sortFlights = (flights: FlightData[]) => {
    return flights.sort((a, b) => {
      if (selectedSort === "price") {
        const getLowestPrice = (pricing: FlightData["pricing"]) => {
          const prices = [
            pricing.economy.price?.amount || Infinity,
            pricing.business.price?.amount || Infinity,
            pricing.firstClass.price?.amount || Infinity,
          ];
          return Math.min(...prices);
        };
        return getLowestPrice(a.pricing) - getLowestPrice(b.pricing);
      } else {
        const durationToMinutes = (duration: string) => {
          const [hours, minutes] = duration
            .replace("h", "")
            .replace("m", "")
            .split(" ");
          return parseInt(hours) * 60 + parseInt(minutes);
        };
        return (
          durationToMinutes(a.totalDuration) -
          durationToMinutes(b.totalDuration)
        );
      }
    });
  };

  return (
    <div className={styles.searchResults}>
      {/* Search Results Header */}
      <div className={styles.header}>
        <h1>{translations.flightSearch.title}</h1>

        <div className={styles.sortOptions}>
          <span>{translations.flightSearch.sortBy} </span>
          <button
            onClick={() => setSelectedSort("price")}
            className={selectedSort === "price" ? styles.activeSort : ""}
          >
            {translations.flightSearch.priceSort}
          </button>
          <button
            onClick={() => setSelectedSort("duration")}
            className={selectedSort === "duration" ? styles.activeSort : ""}
          >
            {translations.flightSearch.durationSort}
          </button>
        </div>
      </div>

      {/* Render Sorted Flight Results */}
      {sortFlights(flightData.searchResults).map((flight, index) => (
        <SingleFlightInfo
          key={index}
          index={index}
          isSelected={selectedFlight === index}
          onSelect={(selectedIndex) => setSelectedFlight(selectedIndex)}
          onReset={resetFlightSelection} // Truyền hàm reset mới
          {...flight}
        />
      ))}
    </div>
  );
};

export default FlightInfo;

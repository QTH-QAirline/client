"use client";
import React, {
  FormEvent,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeftRight, Calendar, User } from "lucide-react";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

// Định nghĩa interface cho sân bay
interface Airport {
  code: string;
  name: string;
  city: string;
}

// Danh sách sân bay
const airports: Airport[] = [
  // Việt Nam
  { code: "HAN", name: "Noi Bai International Airport", city: "Hanoi" },
  {
    code: "SGN",
    name: "Tan Son Nhat International Airport",
    city: "Ho Chi Minh City",
  },
  { code: "DAD", name: "Da Nang International Airport", city: "Da Nang" },
  { code: "PQC", name: "Phu Quoc International Airport", city: "Phu Quoc" },
  { code: "HUI", name: "Phu Bai International Airport", city: "Hue" },
  { code: "CXR", name: "Cam Ranh International Airport", city: "Nha Trang" },
  { code: "VCA", name: "Can Tho International Airport", city: "Can Tho" },
  { code: "HPH", name: "Cat Bi International Airport", city: "Hai Phong" },

  // Quốc tế
  {
    code: "BKK",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    country: "Thailand",
  },
  {
    code: "KUL",
    name: "Kuala Lumpur International Airport",
    city: "Kuala Lumpur",
    country: "Malaysia",
  },
  {
    code: "SIN",
    name: "Changi Airport",
    city: "Singapore",
    country: "Singapore",
  },
  {
    code: "HKG",
    name: "Hong Kong International Airport",
    city: "Hong Kong",
    country: "Hong Kong",
  },
  {
    code: "ICN",
    name: "Incheon International Airport",
    city: "Seoul",
    country: "South Korea",
  },
  {
    code: "NRT",
    name: "Narita International Airport",
    city: "Tokyo",
    country: "Japan",
  },
  {
    code: "LAX",
    name: "Los Angeles International Airport",
    city: "Los Angeles",
    country: "United States",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "United States",
  },
  {
    code: "LHR",
    name: "Heathrow Airport",
    city: "London",
    country: "United Kingdom",
  },
  {
    code: "CDG",
    name: "Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
  },
  {
    code: "FRA",
    name: "Frankfurt Airport",
    city: "Frankfurt",
    country: "Germany",
  },
  {
    code: "DXB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "United Arab Emirates",
  },
  {
    code: "SYD",
    name: "Sydney Kingsford Smith Airport",
    city: "Sydney",
    country: "Australia",
  },
  {
    code: "JNB",
    name: "O.R. Tambo International Airport",
    city: "Johannesburg",
    country: "South Africa",
  },
  {
    code: "GRU",
    name: "São Paulo/Guarulhos–Governador André Franco Montoro International Airport",
    city: "São Paulo",
    country: "Brazil",
  },
  {
    code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    country: "India",
  },
  {
    code: "PEK",
    name: "Beijing Capital International Airport",
    city: "Beijing",
    country: "China",
  },
].sort((a, b) => a.city.localeCompare(b.city)); // Sắp xếp sẵn danh sách theo thành phố;

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
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [filteredFromAirports, setFilteredFromAirports] = useState<Airport[]>(
    []
  );
  const [filteredToAirports, setFilteredToAirports] = useState<Airport[]>([]);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Xử lý click vào input để hiển thị toàn bộ danh sách
  const handleInputFocus = (isFrom: boolean) => {
    if (isFrom) {
      setShowFromDropdown(true);
      setFilteredFromAirports(airports);
    } else {
      setShowToDropdown(true);
      setFilteredToAirports(airports);
    }
  };

  const filterAirports = (value: string) => {
    return airports
      .filter((airport) => {
        const searchValue = value.toLowerCase();
        return (
          airport.code.toLowerCase().includes(searchValue) ||
          airport.name.toLowerCase().includes(searchValue) ||
          airport.city.toLowerCase().includes(searchValue)
        );
      })
      .sort((a, b) => a.city.localeCompare(b.city));
  };

  const handleFromLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromLocation(value);
    setFilteredFromAirports(filterAirports(value));
    setShowFromDropdown(true);
  };

  const handleToLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToLocation(value);
    setFilteredToAirports(filterAirports(value));
    setShowToDropdown(true);
  };

  const handleAirportSelect = (airport: Airport, isFrom: boolean) => {
    const value = `${airport.code} - ${airport.city}`;
    if (isFrom) {
      setFromLocation(value);
      setShowFromDropdown(false); // Ẩn dropdown sau khi chọn
    } else {
      setToLocation(value);
      setShowToDropdown(false); // Ẩn dropdown sau khi chọn
    }
  };

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
              <div className={styles.inputGroup} ref={fromRef}>
                <label className={styles.label}>{translations.fromLabel}</label>
                <input
                  type="text"
                  value={fromLocation}
                  onChange={handleFromLocationChange}
                  onFocus={() => handleInputFocus(true)}
                  className={styles.input}
                  placeholder={translations.fromInput}
                  required
                />
                {showFromDropdown && filteredFromAirports.length > 0 && (
                  <div className={styles.dropdown}>
                    {filteredFromAirports.map((airport) => (
                      <div
                        key={airport.code}
                        className={styles.dropdownItem}
                        onClick={() => handleAirportSelect(airport, true)}
                      >
                        <div className={styles.airportCode}>
                          {airport.code} - {airport.city}
                        </div>
                        <div className={styles.airportName}>{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={swapLocations}
                className={styles.swapButton}
              >
                <ArrowLeftRight className={styles.swapIcon} />
              </button>

              <div className={styles.inputGroup} ref={toRef}>
                <label className={styles.label}>{translations.toLabel}</label>
                <input
                  type="text"
                  value={toLocation}
                  onChange={handleToLocationChange}
                  onFocus={() => handleInputFocus(false)}
                  className={styles.input}
                  placeholder={translations.toInput}
                  required
                />
                {showToDropdown && filteredToAirports.length > 0 && (
                  <div className={styles.dropdown}>
                    {filteredToAirports.map((airport) => (
                      <div
                        key={airport.code}
                        className={styles.dropdownItem}
                        onClick={() => handleAirportSelect(airport, false)}
                      >
                        <div className={styles.airportCode}>
                          {airport.code} - {airport.city}
                        </div>
                        <div className={styles.airportName}>{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
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

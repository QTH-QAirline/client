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

// Thêm interface mới để quản lý chuyến bay đa điểm
interface FlightRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}

// Thêm interface mới cho dropdown states
interface MultiCityDropdownState {
  [key: string]: {
    showFrom: boolean;
    showTo: boolean;
    filteredFrom: Airport[];
    filteredTo: Airport[];
  };
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

  // Thêm state mới cho multi-city
  const [multiCityRoutes, setMultiCityRoutes] = useState<FlightRoute[]>([
    {
      id: "2",
      fromLocation: "",
      toLocation: "",
      dateRange: {
        startDate: undefined,
        endDate: undefined,
      },
    },
  ]);

  // Trong component Header, thêm state mới
  const [multiCityDropdowns, setMultiCityDropdowns] =
    useState<MultiCityDropdownState>({
      "2": {
        showFrom: false,
        showTo: false,
        filteredFrom: [],
        filteredTo: [],
      },
    });

  // Thêm refs cho từng route
  const multiCityRefs = useRef<{ [key: string]: { fromRef: any; toRef: any } }>(
    {}
  );

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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Xử lý cho dropdown chính
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }

      // Xử lý cho multi-city dropdowns
      Object.keys(multiCityRefs.current).forEach((routeId) => {
        const refs = multiCityRefs.current[routeId];
        if (
          refs.fromRef?.current &&
          !refs.fromRef.current.contains(event.target as Node)
        ) {
          setMultiCityDropdowns((prev) => ({
            ...prev,
            [routeId]: { ...prev[routeId], showFrom: false },
          }));
        }
        if (
          refs.toRef?.current &&
          !refs.toRef.current.contains(event.target as Node)
        ) {
          setMultiCityDropdowns((prev) => ({
            ...prev,
            [routeId]: { ...prev[routeId], showTo: false },
          }));
        }
      });
    };

    // Thêm event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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

  // Hàm thêm route mới
  const addNewRoute = () => {
    const newRouteId = (
      Math.max(...multiCityRoutes.map((route) => parseInt(route.id))) + 1
    ).toString();
    setMultiCityRoutes([
      ...multiCityRoutes,
      {
        id: newRouteId,
        fromLocation: "",
        toLocation: "",
        dateRange: {
          startDate: undefined,
          endDate: undefined,
        },
      },
    ]);
    setMultiCityDropdowns((prev) => ({
      ...prev,
      [newRouteId]: {
        showFrom: false,
        showTo: false,
        filteredFrom: [],
        filteredTo: [],
      },
    }));
  };

  // Hàm xóa route
  const removeRoute = (id: string) => {
    if (multiCityRoutes.length > 1) {
      setMultiCityRoutes(multiCityRoutes.filter((route) => route.id !== id));
      // Xóa state dropdown tương ứng
      setMultiCityDropdowns((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // Thêm các hàm xử lý cho multi-city dropdowns
  const handleMultiCityInputFocus = (routeId: string, isFrom: boolean) => {
    setMultiCityDropdowns((prev) => ({
      ...prev,
      [routeId]: {
        ...prev[routeId],
        [isFrom ? "showFrom" : "showTo"]: true,
        [isFrom ? "filteredFrom" : "filteredTo"]: airports,
      },
    }));
  };

  const handleMultiCityLocationChange = (
    routeId: string,
    value: string,
    isFrom: boolean
  ) => {
    // Cập nhật giá trị location
    updateRoute(routeId, isFrom ? "fromLocation" : "toLocation", value);

    // Cập nhật filtered airports
    const filtered = filterAirports(value);
    setMultiCityDropdowns((prev) => ({
      ...prev,
      [routeId]: {
        ...prev[routeId],
        [isFrom ? "filteredFrom" : "filteredTo"]: filtered,
        [isFrom ? "showFrom" : "showTo"]: true,
      },
    }));
  };

  const handleMultiCityAirportSelect = (
    routeId: string,
    airport: Airport,
    isFrom: boolean
  ) => {
    const value = `${airport.code} - ${airport.city}`;
    updateRoute(routeId, isFrom ? "fromLocation" : "toLocation", value);
    setMultiCityDropdowns((prev) => ({
      ...prev,
      [routeId]: {
        ...prev[routeId],
        [isFrom ? "showFrom" : "showTo"]: false,
      },
    }));
  };

  // Hàm cập nhật thông tin route
  const updateRoute = (id: string, field: keyof FlightRoute, value: any) => {
    setMultiCityRoutes(
      multiCityRoutes.map((route) => {
        if (route.id === id) {
          return { ...route, [field]: value };
        }
        return route;
      })
    );
  };

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

    if (tripType === "multiCity") {
      // Kiểm tra điều kiện cho multi-city
      const isValid = multiCityRoutes.every(
        (route) =>
          route.fromLocation &&
          route.toLocation &&
          route.dateRange.startDate &&
          route.dateRange.endDate
      );
      if (!isValid) {
        alert("Vui lòng điền đầy đủ thông tin cho tất cả các chuyến bay");
        return;
      }
      // Tạo object chứa tất cả thông tin
      const searchData = {
        tripType,
        routes: multiCityRoutes,
        travelers,
        ticketClass,
      };

      // Chuyển đổi thành query string
      const queryParams = new URLSearchParams({
        ...searchData,
        routes: JSON.stringify(multiCityRoutes), // Chuyển mảng routes thành chuỗi JSON
      }).toString();

      router.push(`/search-flights/search?${queryParams}`);
    } else {
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
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            {/* Phần Options */}
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

            {/* Phần Main Search */}
            <div className={styles.mainSearchSection}>
              {/* First Flight Route - Luôn hiển thị */}
              <div className={styles.flightRouteContainer}>
                <div className={styles.inputGroup} ref={fromRef}>
                  <label className={styles.label}>
                    {translations.fromLabel}
                  </label>
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
                          <div className={styles.airportName}>
                            {airport.name}
                          </div>
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
                          <div className={styles.airportName}>
                            {airport.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    {translations.dateLabel}
                  </label>
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
              </div>

              {/* Additional Flight Routes for Multi-city */}
              {tripType === "multiCity" && (
                <div className={styles.additionalRoutes}>
                  {multiCityRoutes.map((route) => (
                    <div
                      key={route.id}
                      className={styles.additionalRouteContainer}
                    >
                      <div className={styles.routeHeader}>
                        <span className={styles.routeNumber}>
                          Flight {route.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRoute(route.id)}
                          className={styles.removeRouteBtn}
                        >
                          ✕
                        </button>
                      </div>
                      <div className={styles.routeInputs}>
                        {/* From Location Input */}
                        <div
                          className={styles.inputGroup}
                          ref={(el) => {
                            if (!multiCityRefs.current[route.id]) {
                              multiCityRefs.current[route.id] = {
                                fromRef: { current: null },
                                toRef: { current: null },
                              };
                            }
                            multiCityRefs.current[route.id].fromRef.current =
                              el;
                          }}
                        >
                          <label className={styles.label}>
                            {translations.fromLabel}
                          </label>
                          <input
                            type="text"
                            value={route.fromLocation}
                            onChange={(e) =>
                              updateRoute(
                                route.id,
                                "fromLocation",
                                e.target.value
                              )
                            }
                            onFocus={() =>
                              handleMultiCityInputFocus(route.id, true)
                            }
                            className={styles.input}
                            placeholder={translations.fromInput}
                            required
                          />
                          {multiCityDropdowns[route.id]?.showFrom &&
                            multiCityDropdowns[route.id]?.filteredFrom.length >
                              0 && (
                              <div className={styles.dropdown}>
                                {multiCityDropdowns[route.id].filteredFrom.map(
                                  (airport) => (
                                    <div
                                      key={airport.code}
                                      className={styles.dropdownItem}
                                      onClick={() =>
                                        handleMultiCityAirportSelect(
                                          route.id,
                                          airport,
                                          true
                                        )
                                      }
                                    >
                                      <div className={styles.airportCode}>
                                        {airport.code} - {airport.city}
                                      </div>
                                      <div className={styles.airportName}>
                                        {airport.name}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Swap Button */}
                        <button type="button" className={styles.swapButton}>
                          <ArrowLeftRight className={styles.swapIcon} />
                        </button>

                        {/* To Location Input */}
                        <div
                          className={styles.inputGroup}
                          ref={(el) => {
                            if (!multiCityRefs.current[route.id]) {
                              multiCityRefs.current[route.id] = {
                                fromRef: { current: null },
                                toRef: { current: null },
                              };
                            }
                            multiCityRefs.current[route.id].toRef.current = el;
                          }}
                        >
                          <label className={styles.label}>
                            {translations.toLabel}
                          </label>
                          <input
                            type="text"
                            value={route.toLocation}
                            onChange={(e) =>
                              updateRoute(
                                route.id,
                                "toLocation",
                                e.target.value
                              )
                            }
                            onFocus={() =>
                              handleMultiCityInputFocus(route.id, false)
                            }
                            className={styles.input}
                            placeholder={translations.toInput}
                            required
                          />
                          {multiCityDropdowns[route.id]?.showTo &&
                            multiCityDropdowns[route.id]?.filteredTo.length >
                              0 && (
                              <div className={styles.dropdown}>
                                {multiCityDropdowns[route.id].filteredTo.map(
                                  (airport) => (
                                    <div
                                      key={airport.code}
                                      className={styles.dropdownItem}
                                      onClick={() =>
                                        handleMultiCityAirportSelect(
                                          route.id,
                                          airport,
                                          false
                                        )
                                      }
                                    >
                                      <div className={styles.airportCode}>
                                        {airport.code} - {airport.city}
                                      </div>
                                      <div className={styles.airportName}>
                                        {airport.name}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Date Picker */}
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            {translations.dateLabel}
                          </label>
                          <div className={styles.iconInput}>
                            <Calendar className={styles.inputIcon} />
                            <DatePicker
                              selectsRange={true}
                              startDate={route.dateRange.startDate}
                              endDate={route.dateRange.endDate}
                              onChange={(dates: [Date | null, Date | null]) => {
                                const [start, end] = dates;
                                updateRoute(route.id, "dateRange", {
                                  startDate: start || undefined,
                                  endDate: end || undefined,
                                });
                              }}
                              placeholderText={translations.dateInput}
                              dateFormat="dd/MM/yyyy"
                              className={`${styles.input} ${styles.datepickerInput}`}
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {multiCityRoutes.length < 4 && (
                    <button
                      type="button"
                      onClick={addNewRoute}
                      className={styles.addRouteButton}
                    >
                      + {translations.addFlight}
                    </button>
                  )}
                </div>
              )}

              {/* Common Footer Section */}
              <div className={styles.footerSection}>
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

                <button type="submit" className={styles.searchButton}>
                  <b>{translations.searchButton}</b>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;

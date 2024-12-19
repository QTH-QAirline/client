"use client";
import React, { useState } from "react";
import styles from "./FlightTracking.module.css";
import { Search, Plane, MapPin, Clock, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Flight {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  status: "On Time" | "Delayed" | "Canceled" | "In Air" | "Scheduled";
  estimatedDeparture: string;
  estimatedArrival: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface FlightListItem {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

const FlightTracking: React.FC = () => {
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [flightInfo, setFlightInfo] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"current" | "weekly" | "yearly">(
    "current"
  );

  // Sample flight list data
  const flights: FlightListItem[] = [
    {
      id: "SK-114",
      airline: "Skylight Airlines",
      departure: "New York",
      arrival: "Los Angeles",
      departureTime: "10:00 AM",
      arrivalTime: "1:00 PM",
      status: "On Time",
    },
    {
      id: "FLY-478",
      airline: "Flyfast Airways",
      departure: "London",
      arrival: "New York",
      departureTime: "8:00 AM",
      arrivalTime: "11:00 AM",
      status: "Delayed",
    },
    {
      id: "ARJ-123",
      airline: "AeroJet",
      departure: "Tokyo",
      arrival: "San Francisco",
      departureTime: "2:00 PM",
      arrivalTime: "8:00 AM",
      status: "In Air",
    },
    {
      id: "NB-589",
      airline: "Nimbus Airlines",
      departure: "Sydney",
      arrival: "Singapore",
      departureTime: "8:00 PM",
      arrivalTime: "12:00 AM",
      status: "Scheduled",
    },
    {
      id: "JST-118",
      airline: "JetStream Aviation",
      departure: "Dubai",
      arrival: "London",
      departureTime: "11:00 PM",
      arrivalTime: "6:00 AM",
      status: "Canceled",
    },
  ];

  // Weekly statistics data
  const weeklyData = [
    { name: "Mon", onTime: 85, delayed: 10, canceled: 5 },
    { name: "Tue", onTime: 90, delayed: 8, canceled: 2 },
    { name: "Wed", onTime: 88, delayed: 9, canceled: 3 },
    { name: "Thu", onTime: 92, delayed: 6, canceled: 2 },
    { name: "Fri", onTime: 80, delayed: 15, canceled: 5 },
    { name: "Sat", onTime: 95, delayed: 4, canceled: 1 },
    { name: "Sun", onTime: 87, delayed: 10, canceled: 3 },
  ];

  // Yearly statistics data
  const yearlyData = [
    { name: "Jan", onTime: 88, delayed: 9, canceled: 3 },
    { name: "Feb", onTime: 85, delayed: 12, canceled: 3 },
    { name: "Mar", onTime: 90, delayed: 8, canceled: 2 },
    { name: "Apr", onTime: 87, delayed: 10, canceled: 3 },
    { name: "May", onTime: 92, delayed: 6, canceled: 2 },
    { name: "Jun", onTime: 95, delayed: 4, canceled: 1 },
    { name: "Jul", onTime: 89, delayed: 8, canceled: 3 },
    { name: "Aug", onTime: 86, delayed: 11, canceled: 3 },
    { name: "Sep", onTime: 91, delayed: 7, canceled: 2 },
    { name: "Oct", onTime: 88, delayed: 9, canceled: 3 },
    { name: "Nov", onTime: 87, delayed: 10, canceled: 3 },
    { name: "Dec", onTime: 83, delayed: 13, canceled: 4 },
  ];

  const searchFlight = () => {
    if (flightNumber) {
      const mockFlightData: Flight = {
        flightNumber: flightNumber,
        departureAirport: "LHR",
        arrivalAirport: "JFK",
        status: "On Time",
        estimatedDeparture: "2024-03-15T08:00:00",
        estimatedArrival: "2024-03-15T10:30:00",
        currentLocation: {
          latitude: 51.47,
          longitude: -0.4543,
        },
      };

      setFlightInfo(mockFlightData);
      setError(null);
    } else {
      setError("Please enter a flight number");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Enter flight number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={searchFlight} className={styles.searchButton}>
            <Search size={20} />
            Search
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <Info size={20} color="red" />
            {error}
          </div>
        )}

        {flightInfo && (
          <div className={styles.flightInfoCard}>
            <div className={styles.flightHeader}>
              <Plane size={30} />
              <h2>Flight {flightInfo.flightNumber}</h2>
            </div>

            <div className={styles.flightDetails}>
              <div className={styles.detailItem}>
                <MapPin size={20} />
                <span>
                  Departure: {flightInfo.departureAirport} → Arrival:{" "}
                  {flightInfo.arrivalAirport}
                </span>
              </div>

              <div className={styles.detailItem}>
                <Clock size={20} />
                <span>
                  Estimated Departure Time:{" "}
                  {new Date(flightInfo.estimatedDeparture).toLocaleString()}
                </span>
              </div>

              <div className={styles.detailItem}>
                <Info size={20} />
                <span>
                  Status:{" "}
                  <span
                    className={
                      styles[`status-${flightInfo.status.toLowerCase()}`]
                    }
                  >
                    {flightInfo.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.fullWidthSection}>
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabButton} ${
                activeView === "current" ? styles.active : ""
              }`}
              onClick={() => setActiveView("current")}
            >
              Current Flights
            </button>
            <button
              className={`${styles.tabButton} ${
                activeView === "weekly" ? styles.active : ""
              }`}
              onClick={() => setActiveView("weekly")}
            >
              Weekly Stats
            </button>
            <button
              className={`${styles.tabButton} ${
                activeView === "yearly" ? styles.active : ""
              }`}
              onClick={() => setActiveView("yearly")}
            >
              Yearly Stats
            </button>
          </div>

          {activeView === "current" && (
            <div className={styles.enhancedFlightList}>
              {flights.map((flight) => (
                <div key={flight.id} className={styles.enhancedFlightListItem}>
                  <div className={styles.flightListHeader}>
                    <div className={styles.flightRouteInfo}>
                      <div className={styles.routeDetails}>
                        <span className={styles.departureCity}>
                          {flight.departure}
                        </span>
                        <Plane size={16} className={styles.routeArrow} />
                        <span className={styles.arrivalCity}>
                          {flight.arrival}
                        </span>
                      </div>
                      <span className={styles.flightId}>{flight.id}</span>
                    </div>
                    <span
                      className={
                        styles[
                          `status-${flight.status
                            .toLowerCase()
                            .replace(" ", "-")}`
                        ]
                      }
                    >
                      {flight.status}
                    </span>
                  </div>
                  <div className={styles.flightDetailsBottom}>
                    <div className={styles.airlineInfo}>
                      <span>{flight.airline}</span>
                    </div>
                    <div className={styles.timeInfo}>
                      <Clock size={16} />
                      <span>
                        {flight.departureTime} - {flight.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === "weekly" && (
            <div className={styles.statsContainer}>
              {/* <h3>Weekly Flight Statistics</h3> */}
              <div className={styles.improvedChartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: "#666" }} />
                    <YAxis tick={{ fill: "#666" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar
                      dataKey="onTime"
                      stackId="a"
                      fill="#1dad93"
                      name="On Time"
                    />
                    <Bar
                      dataKey="delayed"
                      stackId="a"
                      fill="#f97316"
                      name="Delayed"
                    />
                    <Bar
                      dataKey="canceled"
                      stackId="a"
                      fill="#ef4444"
                      name="Canceled"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === "yearly" && (
            <div className={styles.statsContainer}>
              {/* <h3>Yearly Flight Statistics</h3> */}
              <div className={styles.improvedChartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: "#666" }} />
                    <YAxis tick={{ fill: "#666" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar
                      dataKey="onTime"
                      stackId="a"
                      fill="#1dad93"
                      name="On Time"
                    />
                    <Bar
                      dataKey="delayed"
                      stackId="a"
                      fill="#f97316"
                      name="Delayed"
                    />
                    <Bar
                      dataKey="canceled"
                      stackId="a"
                      fill="#ef4444"
                      name="Canceled"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightTracking;

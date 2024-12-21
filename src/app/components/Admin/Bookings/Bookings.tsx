"use client";
import React, { useState, useMemo, useEffect } from "react";
import styles from "./Bookings.module.css";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Booking data interface
interface Booking {
  id: string;
  customerName: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  bookingDate: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  ticketClass: "Economy" | "Business" | "First";
  totalPrice: number;
}

// Sales data for chart
const salesData = {
  week: [
    { date: "Mon", Economy: 50, Business: 20, First: 5 },
    { date: "Tue", Economy: 55, Business: 25, First: 7 },
    { date: "Wed", Economy: 60, Business: 30, First: 8 },
    { date: "Thu", Economy: 58, Business: 22, First: 6 },
    { date: "Fri", Economy: 65, Business: 35, First: 10 },
    { date: "Sat", Economy: 70, Business: 40, First: 12 },
    { date: "Sun", Economy: 75, Business: 45, First: 15 },
  ],
  month: [
    { date: "Week 1", Economy: 250, Business: 100, First: 30 },
    { date: "Week 2", Economy: 280, Business: 120, First: 35 },
    { date: "Week 3", Economy: 300, Business: 140, First: 40 },
    { date: "Week 4", Economy: 320, Business: 160, First: 45 },
  ],
  year: [
    { date: "Jan", Economy: 1200, Business: 500, First: 150 },
    { date: "Feb", Economy: 1300, Business: 550, First: 170 },
    { date: "Mar", Economy: 1400, Business: 600, First: 190 },
    { date: "Apr", Economy: 1500, Business: 650, First: 210 },
    { date: "May", Economy: 1600, Business: 700, First: 230 },
    { date: "Jun", Economy: 1700, Business: 750, First: 250 },
    { date: "Jul", Economy: 1800, Business: 800, First: 270 },
    { date: "Aug", Economy: 1900, Business: 850, First: 290 },
    { date: "Sep", Economy: 2000, Business: 900, First: 310 },
    { date: "Oct", Economy: 2100, Business: 950, First: 330 },
    { date: "Nov", Economy: 2200, Business: 1000, First: 350 },
    { date: "Dec", Economy: 2300, Business: 1050, First: 370 },
  ],
};

// Initial bookings mock data
const initialBookings: Booking[] = [
  {
    id: "B001",
    customerName: "John Doe",
    flightNumber: "FL123",
    departureCity: "New York",
    arrivalCity: "Los Angeles",
    bookingDate: "2024-06-15",
    status: "Confirmed",
    ticketClass: "Economy",
    totalPrice: 350,
  },
  {
    id: "B002",
    customerName: "Jane Smith",
    flightNumber: "FL456",
    departureCity: "Chicago",
    arrivalCity: "Miami",
    bookingDate: "2024-06-20",
    status: "Pending",
    ticketClass: "Business",
    totalPrice: 750,
  },
  {
    id: "B003",
    customerName: "Mike Johnson",
    flightNumber: "FL789",
    departureCity: "San Francisco",
    arrivalCity: "Seattle",
    bookingDate: "2024-06-18",
    status: "Confirmed",
    ticketClass: "First",
    totalPrice: 1200,
  },
];

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<{
    status?: Booking["status"];
    ticketClass?: Booking["ticketClass"];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "week"
  );

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        

        if (!token) {
          console.log("No token found in localStorage.");
          return;
        }
        console.log(token);

        const response = await axios.get(`${BACKEND_URL}/admin/booking`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Memoized filtering logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        (filter.status ? booking.status === filter.status : true) &&
        (filter.ticketClass
          ? booking.ticketClass === filter.ticketClass
          : true) &&
        (searchTerm
          ? booking.customerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.flightNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : true)
    );
  }, [bookings, filter, searchTerm]);

  // Get current sales data based on time period
  const currentSalesData = salesData[timePeriod];

  // Status color mapping
  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return styles.statusConfirmed;
      case "Pending":
        return styles.statusPending;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({});
    setSearchTerm("");
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.controlPanel}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name or flight number"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.filterContainer}>
          <select
            className={styles.filterSelect}
            value={filter.status || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value as Booking["status"],
              }))
            }
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filter.ticketClass || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                ticketClass: e.target.value as Booking["ticketClass"],
              }))
            }
          >
            <option value="">All Classes</option>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First">First</option>
          </select>

          {(filter.status || filter.ticketClass || searchTerm) && (
            <button
              className={styles.resetFiltersButton}
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className={styles.statisticsPanel}>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p>{filteredBookings.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p>
            $
            {filteredBookings
              .reduce((sum, booking) => sum + booking.totalPrice, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.salesChartContainer}>
        <div className={styles.chartHeader}>
          <h2>Ticket Sales by Class</h2>
          <div className={styles.chartControls}>
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                className={timePeriod === period ? styles.activeButton : ""}
                onClick={() => setTimePeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentSalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#666" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="Economy"
              stroke="#8884d8"
              name="Economy"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="Business"
              stroke="#82ca9d"
              name="Business"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="First"
              stroke="#ffc658"
              name="First"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.bookingTable}>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Flight</th>
              <th>Booking Date</th>
              <th>Class</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customerName}</td>
                <td>
                  {booking.flightNumber} ({booking.departureCity} -{" "}
                  {booking.arrivalCity})
                </td>
                <td>{booking.bookingDate}</td>
                <td>
                  {booking.ticketClass === "Economy"
                    ? "Economy"
                    : booking.ticketClass === "Business"
                    ? "Business"
                    : "First"}
                </td>
                <td>${booking.totalPrice.toLocaleString()}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status === "Confirmed"
                      ? "Confirmed"
                      : booking.status === "Pending"
                      ? "Pending"
                      : "Cancelled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;

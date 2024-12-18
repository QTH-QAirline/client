"use client";
import React, { useState, useMemo } from "react";
import styles from "./Bookings.module.css";
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

// Booking data interface
interface Booking {
  id: string;
  customerName: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  ticketClass: "economy" | "business" | "first";
  totalPrice: number;
}

// Sales data for chart
const salesData = {
  week: [
    { date: "Mon", economy: 50, business: 20, first: 5 },
    { date: "Tue", economy: 55, business: 25, first: 7 },
    { date: "Wed", economy: 60, business: 30, first: 8 },
    { date: "Thu", economy: 58, business: 22, first: 6 },
    { date: "Fri", economy: 65, business: 35, first: 10 },
    { date: "Sat", economy: 70, business: 40, first: 12 },
    { date: "Sun", economy: 75, business: 45, first: 15 },
  ],
  month: [
    { date: "Week 1", economy: 250, business: 100, first: 30 },
    { date: "Week 2", economy: 280, business: 120, first: 35 },
    { date: "Week 3", economy: 300, business: 140, first: 40 },
    { date: "Week 4", economy: 320, business: 160, first: 45 },
  ],
  year: [
    { date: "Jan", economy: 1200, business: 500, first: 150 },
    { date: "Feb", economy: 1300, business: 550, first: 170 },
    { date: "Mar", economy: 1400, business: 600, first: 190 },
    { date: "Apr", economy: 1500, business: 650, first: 210 },
    { date: "May", economy: 1600, business: 700, first: 230 },
    { date: "Jun", economy: 1700, business: 750, first: 250 },
    { date: "Jul", economy: 1800, business: 800, first: 270 },
    { date: "Aug", economy: 1900, business: 850, first: 290 },
    { date: "Sep", economy: 2000, business: 900, first: 310 },
    { date: "Oct", economy: 2100, business: 950, first: 330 },
    { date: "Nov", economy: 2200, business: 1000, first: 350 },
    { date: "Dec", economy: 2300, business: 1050, first: 370 },
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
    status: "confirmed",
    ticketClass: "economy",
    totalPrice: 350,
  },
  {
    id: "B002",
    customerName: "Jane Smith",
    flightNumber: "FL456",
    departureCity: "Chicago",
    arrivalCity: "Miami",
    bookingDate: "2024-06-20",
    status: "pending",
    ticketClass: "business",
    totalPrice: 750,
  },
  {
    id: "B003",
    customerName: "Mike Johnson",
    flightNumber: "FL789",
    departureCity: "San Francisco",
    arrivalCity: "Seattle",
    bookingDate: "2024-06-18",
    status: "confirmed",
    ticketClass: "first",
    totalPrice: 1200,
  },
];

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<{
    status?: Booking["status"];
    ticketClass?: Booking["ticketClass"];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "week"
  );

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
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "cancelled":
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
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
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
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
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
              dataKey="economy"
              stroke="#8884d8"
              name="Economy"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="business"
              stroke="#82ca9d"
              name="Business"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="first"
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
                  {booking.ticketClass === "economy"
                    ? "Economy"
                    : booking.ticketClass === "business"
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
                    {booking.status === "confirmed"
                      ? "Confirmed"
                      : booking.status === "pending"
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

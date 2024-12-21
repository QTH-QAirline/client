"use client";
import React, { useEffect, useState } from "react";
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
import styles from "./Dashboard.module.css";
import { useRouter } from "next/navigation";



interface DashboardData {
  completedFlights: number;
  activeFlights: number;
  cancelledFlights: number;
  revenue: string;
  ticketsSold: number;
}
// Mock data giữ nguyên như cũ...
const weeklyData = [
  { day: "Monday", tickets: 120 },
  { day: "Tuesday", tickets: 150 },
  { day: "Wednesday", tickets: 180 },
  { day: "Thursday", tickets: 140 },
  { day: "Friday", tickets: 200 },
  { day: "Saturday", tickets: 160 },
  { day: "Sunday", tickets: 130 },
];

const yearlyData = [
  { month: "Jan", tickets: 1200 },
  { month: "Feb", tickets: 1400 },
  { month: "Mar", tickets: 1600 },
  { month: "Apr", tickets: 1300 },
  { month: "May", tickets: 1700 },
  { month: "Jun", tickets: 1500 },
  { month: "Jul", tickets: 1800 },
  { month: "Aug", tickets: 1900 },
  { month: "Sep", tickets: 1600 },
  { month: "Oct", tickets: 1400 },
  { month: "Nov", tickets: 1300 },
  { month: "Dec", tickets: 1700 },
];

const promotions = [
  {
    id: 1,
    name: "Summer Holiday Special",
    discount: "20% Off",
    code: "SUMMER20",
    validUntil: "August 31, 2024",
    status: "Active",
  },
  {
    id: 2,
    name: "Weekend Getaway Deal",
    discount: "15% Off",
    code: "WEEKEND15",
    validUntil: "July 15, 2024",
    status: "Active",
  },
  {
    id: 3,
    name: "Early Bird Special",
    discount: "25% Off",
    code: "EARLY25",
    validUntil: "June 30, 2024",
    status: "Coming Soon",
  },
];
// Hàm fetch API có xử lý token hết hạn
const fetchWithAuth = async (url: string, router: any, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Xử lý khi token hết hạn
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    router.push("/admin/login"); // Điều hướng về trang đăng nhập
    return null;
  }

  return response;
};

const Dashboard: React.FC = () => {
  const [chartView, setChartView] = useState<"weekly" | "yearly">("weekly");

  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();
  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) throw new Error("Backend URL is not configured.");

        const response = await fetchWithAuth(`${backendUrl}/auth/admin/dashboard`, router, {
          method: "GET",
        });

        if (response) {
          // const result: DashboardData = await response.json();
          // setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className={styles.dashboard}>
      {/* Top Row - Flight Overview */}
      <div className={styles.topRow}>
        <div className={styles.flightCard}>
          <div className={styles.flightIcon}>✈️</div>
          <div className={styles.flightInfo}>
            <h3>Completed Flights</h3>
            <div className={styles.flightNumber}>125</div>
            <div className={styles.flightTrend}>↑ 1.35%</div>
          </div>
        </div>

        <div className={styles.flightCard}>
          <div className={styles.flightIcon}>🛫</div>
          <div className={styles.flightInfo}>
            <h3>Active Flights</h3>
            <div className={styles.flightNumber}>80</div>
            <div className={styles.flightTrend}>↑ 3.68%</div>
          </div>
        </div>

        <div className={styles.flightCard}>
          <div className={styles.flightIcon}>❌</div>
          <div className={styles.flightInfo}>
            <h3>Canceled Flights</h3>
            <div className={styles.flightNumber}>25</div>
            <div className={`${styles.flightTrend} ${styles.negativeTrend}`}>
              ↓ 1.45%
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Ticket Sales Chart */}
        <div className={styles.statsCard}>
          <div className={styles.chartHeader}>
            <h2>Ticket Sales</h2>
            <div className={styles.chartToggle}>
              <button
                className={`${styles.toggleButton} ${
                  chartView === "weekly" ? styles.active : ""
                }`}
                onClick={() => setChartView("weekly")}
              >
                Weekly
              </button>
              <button
                className={`${styles.toggleButton} ${
                  chartView === "yearly" ? styles.active : ""
                }`}
                onClick={() => setChartView("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartView === "weekly" ? weeklyData : yearlyData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartView === "weekly" ? "day" : "month"} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#8884d8"
                  name="Tickets Sold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Statistics */}
        <div className={styles.statsCard}>
          <h2>Quick Statistics</h2>
          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>💰</div>
              <div className={styles.quickStatInfo}>
                <span>Monthly Revenue</span>
                <div className={styles.quickStatValue}>$1,250,000</div>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>✈️</div>
              <div className={styles.quickStatInfo}>
                <span>Flights Today</span>
                <div className={styles.quickStatValue}>35</div>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>🎫</div>
              <div className={styles.quickStatInfo}>
                <span>Total Tickets Sold</span>
                <div className={styles.quickStatValue}>24,680</div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Table */}
        <div className={styles.statsCard}>
          <h2>Current Promotions</h2>
          <div className={styles.promotionsTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Promotion Name</th>
                  <th>Discount</th>
                  <th>Code</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td>{promo.name}</td>
                    <td>{promo.discount}</td>
                    <td>
                      <code>{promo.code}</code>
                    </td>
                    <td>{promo.validUntil}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[promo.status.toLowerCase()]
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

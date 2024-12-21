"use client";
import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


interface Flight {
  id: string;
  aircraft_id: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  status: "Scheduled" | "Delayed";
  delayReason?: string; // Thêm trường lý do delay
  basePrice: number;
}

const Schedule: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        

        if (!token) {
          console.log("No token found in localStorage.");
          return;
        }
        console.log(token);

        const response = await axios.get(`${BACKEND_URL}/admin/flight`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setFlights(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const [delayedFlight, setDelayedFlight] = useState<Flight | null>(null);
  // const [newDepartureTime, setNewDepartureTime] = useState("");
  const [delayMinutes, setDelayMinutes] = useState<number>(0);
  const [delayReason, setDelayReason] = useState(""); // State mới cho lý do delay
  const [newDepartureDate, setNewDepartureDate] = useState("");
  const [newArrivalDate, setNewArrivalDate] = useState("");

  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    aircraft_id: "",
    departureCity: "",
    arrivalCity: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
    basePrice: 0,
  });

  const validateDates = (
    depDate: string,
    arrDate: string,
    depTime: string,
    arrTime: string
  ): boolean => {
    const departure = new Date(`${depDate}T${depTime}`);
    const arrival = new Date(`${arrDate}T${arrTime}`);
    return departure < arrival;
  };

  const handleDelayFlight = async (flight: Flight) => {
    setDelayedFlight(flight);
    setDelayMinutes(0); // Reset số phút delay về 0
    setDelayReason(flight.delayReason || ""); // Reset lý do delay thành rỗng nếu chưa có
  };

  const handleSaveDelay = async () => {
    if (!delayedFlight || !delayReason || delayMinutes <= 0) return;

    const newTimes = calculateNewTimes(delayedFlight, delayMinutes);

    const token = localStorage.getItem("token");
        

    if (!token) {
      console.log("No token found in localStorage.");
      return;
    }
    console.log(token);
    
    await axios.put(
      `${BACKEND_URL}/admin/flight`,
      {
        flight_id: Number(delayedFlight.id),
         reason: delayedFlight.delayReason,
        delay_date: `${newTimes.newDepartureDate}T${newTimes.newDepartureTime}:00`
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đảm bảo sử dụng đúng dấu backtick
        },
      }
    );
    console.log(delayedFlight.id);

    setFlights(
      flights.map((f) =>
        f.id === delayedFlight.id
          ? {
              ...f,
              departureDate: newTimes.newDepartureDate,
              departureTime: newTimes.newDepartureTime,
              arrivalDate: newTimes.newArrivalDate,
              arrivalTime: newTimes.newArrivalTime,
              status: "Delayed",
              delayReason: delayReason,
            }
          : f
      )
    );

    setDelayedFlight(null);
    setDelayMinutes(0);
    setDelayReason("");
  };

  const handleAddFlight = async () => {
    if (
      !validateDates(
        newFlight.departureDate!,
        newFlight.arrivalDate!,
        newFlight.departureTime!,
        newFlight.arrivalTime!
      )
    ) {
      alert("Thời gian đến phải sau thời gian khởi hành!");
      return;
    }

    const newFlightData: Flight = {
      id: `F${flights.length + 1}`,
      aircraft_id: newFlight.aircraft_id!,
      departureCity: newFlight.departureCity!,
      arrivalCity: newFlight.arrivalCity!,
      departureDate: newFlight.departureDate!,
      arrivalDate: newFlight.arrivalDate!,
      departureTime: newFlight.departureTime!,
      arrivalTime: newFlight.arrivalTime!,
      status: "Scheduled",
      basePrice: newFlight.basePrice!,
    };
    const token = localStorage.getItem("token");
    

    if (!token) {
      console.log("No token found in localStorage.");
      return;
    }
    console.log(token);

    const departure = await axios.get(`${BACKEND_URL}/admin/change/${newFlightData.departureCity}`, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Đảm bảo sử dụng đúng dấu backtick
      },
    }
    );
    const departureData = departure.data;
    const arrival = await axios.get(`${BACKEND_URL}/admin/change/${newFlightData.arrivalCity}`, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Đảm bảo sử dụng đúng dấu backtick
      },
    }
    );
    const arrivalData = arrival.data;

    
    const response = await axios.post(
      `${BACKEND_URL}/admin/flight`,
      {
        aircraft_id: Number(newFlightData.aircraft_id),
        departure_airport: departureData.airport_id,
        arrival_airport: arrivalData.airport_id,
        departure_time: new Date(
          `${newFlightData.departureDate}T${newFlightData.departureTime}:00`
        ),
        arrival_time: new Date(
          `${newFlightData.arrivalDate}T${newFlightData.arrivalTime}:00`
        ),
        base_price: newFlightData.basePrice,
        created_at: new Date(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đảm bảo sử dụng đúng dấu backtick
        },
      }
    );
    console.log("respond: ")
    console.log(response.data);
    console.log(newFlightData.id);
    newFlightData.id = response.data;
    newFlightData.departureCity = departureData.location;
    newFlightData.arrivalCity = arrivalData.location;
    
    const object = {
      aircraft_id: newFlightData.aircraft_id,
        departure_airport: newFlightData.departureCity,
        arrival_airport: newFlightData.arrivalCity,
        departure_time: new Date(`${newFlightData.departureDate}T${newFlightData.departureTime}:00`),
        arrival_time: new Date(`${newFlightData.arrivalDate}T${newFlightData.arrivalTime}:00`),
        base_price: newFlightData.basePrice,
        created_at: new Date(),
    }
    console.log({
        object
    });
    setFlights([...flights, newFlightData]);
    setNewFlight({
      aircraft_id: "",
      departureCity: "",
      arrivalCity: "",
      departureDate: "",
      arrivalDate: "",
      departureTime: "",
      arrivalTime: "",
      basePrice: 0,
    });
  };

  const calculateNewTimes = (flight: Flight, delayMinutes: number) => {
    // Create Date objects for departure and arrival times
    const departure = new Date(
      `${flight.departureDate}T${flight.departureTime}`
    );
    const arrival = new Date(`${flight.arrivalDate}T${flight.arrivalTime}`);

    // Calculate original flight duration in minutes
    const originalFlightDuration =
      (arrival.getTime() - departure.getTime()) / (1000 * 60);

    // Add delay to departure time
    const newDeparture = new Date(
      departure.getTime() + delayMinutes * 60 * 1000
    );

    // Calculate new arrival time by adding original flight duration to new departure time
    const newArrival = new Date(
      newDeparture.getTime() + originalFlightDuration * 60 * 1000
    );

    // Format dates - handle year, month, day properly
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Format times with proper hour/minute handling
    const formatTime = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return {
      newDepartureDate: formatDate(newDeparture),
      newDepartureTime: formatTime(newDeparture),
      newArrivalDate: formatDate(newArrival),
      newArrivalTime: formatTime(newArrival),
    };
  };

  const handleDeleteFlight = (id: string) => {
    const flight = flights.find((f) => f.id === id);
    setFlights(flights.filter((f) => f.id !== id));

  };

  return (
    <div className={styles.scheduleContainer}>
      {/* <h1 className={styles.title}>Flight Schedule</h1> */}

      <div className={styles.newFlightForm}>
        <h2>Add New Flight</h2>
        {/* <div className={styles.formGroup}>
          <label htmlFor="flightNumber">Flight Number:</label>
          <input
            type="text"
            id="flightNumber"
            value={newFlight.flightNumber}
            onChange={(e) =>
              setNewFlight({ ...newFlight, flightNumber: e.target.value })
            }
          />
        </div> */}
        <div className={styles.formGroup}>
          <label htmlFor="aircraft_id">Aircraft ID:</label>
          <input
            type="text"
            id="aircraft_id"
            value={newFlight.aircraft_id}
            onChange={(e) =>
              setNewFlight({ ...newFlight, aircraft_id: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="basePrice">Base Price:</label>
          <input
            type="number"
            id="basePrice"
            value={newFlight.basePrice}
            onChange={(e) =>
              setNewFlight({ ...newFlight, basePrice: Number(e.target.value) })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="departureCity">Departure City:</label>
          <input
            type="text"
            id="departureCity"
            value={newFlight.departureCity}
            onChange={(e) =>
              setNewFlight({ ...newFlight, departureCity: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="arrivalCity">Arrival City:</label>
          <input
            type="text"
            id="arrivalCity"
            value={newFlight.arrivalCity}
            onChange={(e) =>
              setNewFlight({ ...newFlight, arrivalCity: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="departureDate">Departure Date:</label>
          <input
            type="date"
            id="departureDate"
            value={newFlight.departureDate}
            onChange={(e) =>
              setNewFlight({ ...newFlight, departureDate: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="arrivalDate">Arrival Date:</label>
          <input
            type="date"
            id="arrivalDate"
            value={newFlight.arrivalDate}
            onChange={(e) =>
              setNewFlight({ ...newFlight, arrivalDate: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="departureTime">Departure Time:</label>
          <input
            type="time"
            id="departureTime"
            value={newFlight.departureTime}
            onChange={(e) =>
              setNewFlight({ ...newFlight, departureTime: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="arrivalTime">Arrival Time:</label>
          <input
            type="time"
            id="arrivalTime"
            value={newFlight.arrivalTime}
            onChange={(e) =>
              setNewFlight({ ...newFlight, arrivalTime: e.target.value })
            }
          />
        </div>
        <button className={styles.addButton} onClick={handleAddFlight}>
          Add Flight
        </button>
      </div>

      <table className={styles.flightTable}>
        <thead>
          <tr>
            <th>Aircraft_ID</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Departure Date</th>
            <th>Arrival Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Status</th>
            <th>Delay Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.aircraft_id}</td>
              <td>{flight.departureCity}</td>
              <td>{flight.arrivalCity}</td>
              <td>{flight.departureDate}</td>
              <td>{flight.arrivalDate}</td>
              <td>{flight.departureTime}</td>
              <td>{flight.arrivalTime}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${
                    flight.status === "Scheduled"
                      ? styles.statusOnTime
                      : styles.statusDelayed
                  }`}
                >
                  {flight.status}
                </span>
              </td>
              <td>{flight.delayReason || "-"}</td>
              <td>
                {
                  <button
                    className={styles.delayButton}
                    onClick={() => handleDelayFlight(flight)}
                  >
                    Delay
                  </button>
                }
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteFlight(flight.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {delayedFlight && (
        <div className={styles.delayModal}>
          <h2>Delay Flight</h2>
          <p>
            Flight Number: {delayedFlight.aircraft_id} (
            {delayedFlight.departureCity}- {delayedFlight.arrivalCity})
          </p>
          <label htmlFor="delayMinutes">Number of minutes delay</label>
          <input
            type="number"
            id="delayMinutes"
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            min="1"
          />
          <div className={styles.modalFormGroup}>
            <label htmlFor="delayReason">Reason for delay:</label>
            <textarea
              id="delayReason"
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              rows={3}
              placeholder="Type reason for delay..."
              className={styles.delayReasonInput}
            />
          </div>
          <div className={styles.modalActions}>
            <button
              className={styles.saveButton}
              onClick={handleSaveDelay}
              disabled={!delayReason.trim() || delayMinutes <= 0}
            >
              Save
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setDelayedFlight(null);
                setDelayMinutes(0);
                setDelayReason("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;

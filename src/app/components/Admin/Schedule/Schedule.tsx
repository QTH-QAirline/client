"use client";
import React, { useState } from "react";
import styles from "./Schedule.module.css";

interface Flight {
  id: string;
  flightNumber: string;
  aircraft: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  status: "onTime" | "delayed";
}

const Schedule: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: "F001",
      flightNumber: "FL123",
      aircraft: "Boeing 737",
      departureCity: "New York",
      arrivalCity: "Los Angeles",
      departureDate: "2024-06-15",
      arrivalDate: "2024-06-15",
      departureTime: "09:00",
      arrivalTime: "12:00",
      status: "onTime",
    },
    {
      id: "F002",
      flightNumber: "FL456",
      aircraft: "Airbus A320",
      departureCity: "Chicago",
      arrivalCity: "Miami",
      departureDate: "2024-06-15",
      arrivalDate: "2024-06-15",
      departureTime: "14:30",
      arrivalTime: "17:45",
      status: "onTime",
    },
    {
      id: "F003",
      flightNumber: "FL789",
      aircraft: "Boeing 777",
      departureCity: "San Francisco",
      arrivalCity: "Seattle",
      departureDate: "2024-06-15",
      arrivalDate: "2024-06-15",
      departureTime: "20:15",
      arrivalTime: "22:30",
      status: "onTime",
    },
  ]);

  const [delayedFlight, setDelayedFlight] = useState<Flight | null>(null);
  const [newDepartureTime, setNewDepartureTime] = useState("");
  const [newDepartureDate, setNewDepartureDate] = useState("");
  const [newArrivalDate, setNewArrivalDate] = useState("");

  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    flightNumber: "",
    aircraft: "",
    departureCity: "",
    arrivalCity: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
  });

  const handleDelayFlight = (flight: Flight) => {
    setDelayedFlight(flight);
    setNewDepartureTime(flight.departureTime);
  };

  const handleSaveDelay = () => {
    if (delayedFlight) {
      setFlights(
        flights.map((f) =>
          f.id === delayedFlight.id
            ? { ...f, departureTime: newDepartureTime, status: "delayed" }
            : f
        )
      );
      setDelayedFlight(null);
      setNewDepartureTime("");
    }
  };

  const handleAddFlight = () => {
    const newFlightData: Flight = {
      id: `F${flights.length + 1}`,
      flightNumber: newFlight.flightNumber!,
      aircraft: newFlight.aircraft!,
      departureCity: newFlight.departureCity!,
      arrivalCity: newFlight.arrivalCity!,
      departureDate: newFlight.departureDate!,
      arrivalDate: newFlight.arrivalDate!,
      departureTime: newFlight.departureTime!,
      arrivalTime: newFlight.arrivalTime!,
      status: "onTime",
    };
    setFlights([...flights, newFlightData]);
    setNewFlight({
      flightNumber: "",
      aircraft: "",
      departureCity: "",
      arrivalCity: "",
      departureDate: "",
      arrivalDate: "",
      departureTime: "",
      arrivalTime: "",
    });
  };

  const handleDeleteFlight = (id: string) => {
    setFlights(flights.filter((f) => f.id !== id));
  };

  return (
    <div className={styles.scheduleContainer}>
      {/* <h1 className={styles.title}>Flight Schedule</h1> */}

      <div className={styles.newFlightForm}>
        <h2>Add New Flight</h2>
        <div className={styles.formGroup}>
          <label htmlFor="flightNumber">Flight Number:</label>
          <input
            type="text"
            id="flightNumber"
            value={newFlight.flightNumber}
            onChange={(e) =>
              setNewFlight({ ...newFlight, flightNumber: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="aircraft">Aircraft:</label>
          <input
            type="text"
            id="aircraft"
            value={newFlight.aircraft}
            onChange={(e) =>
              setNewFlight({ ...newFlight, aircraft: e.target.value })
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
            <th>Flight Number</th>
            <th>Aircraft</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Departure Date</th>
            <th>Arrival Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.flightNumber}</td>
              <td>{flight.aircraft}</td>
              <td>{flight.departureCity}</td>
              <td>{flight.arrivalCity}</td>
              <td>{flight.departureDate}</td>
              <td>{flight.arrivalDate}</td>
              <td>{flight.departureTime}</td>
              <td>{flight.arrivalTime}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${
                    flight.status === "onTime"
                      ? styles.statusOnTime
                      : styles.statusDelayed
                  }`}
                >
                  {flight.status}
                </span>
              </td>
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
            Flight Number: {delayedFlight.flightNumber} (
            {delayedFlight.departureCity}- {delayedFlight.arrivalCity})
          </p>
          <label htmlFor="newDepartureTime">New Departure Time:</label>
          <input
            type="time"
            id="newDepartureTime"
            value={newDepartureTime}
            onChange={(e) => setNewDepartureTime(e.target.value)}
          />
          <div className={styles.modalActions}>
            <button className={styles.saveButton} onClick={handleSaveDelay}>
              Save
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setDelayedFlight(null)}
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

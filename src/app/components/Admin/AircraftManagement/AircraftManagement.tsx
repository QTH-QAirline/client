"use client";
import React, { useState } from "react";
import styles from "./AircraftManagement.module.css";

interface Aircraft {
  id: number; // để không xóa nhầm
  manufacturer: string;
  model: string;
  yearManufactured: number;
  seatConfiguration: {
    economyClass: number;
    businessClass: number;
    firstClass: number;
  };
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const AircraftManagement: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [nextId, setNextId] = useState(1); // State để theo dõi id tiếp theo
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null
  );
  const [newAircraft, setNewAircraft] = useState<Omit<Aircraft, "id">>({
    manufacturer: "",
    model: "",
    yearManufactured: new Date().getFullYear(),
    seatConfiguration: {
      economyClass: 0,
      businessClass: 0,
      firstClass: 0,
    },
  });
  const [error, setError] = useState<string>("");

  // Cập nhật hàm gọi API để phù hợp với Hono backend
  const addAircraftToServer = async (aircraftData: typeof newAircraft) => {
    try {
      // Lấy token từ localStorage (giả sử đã được lưu sau khi đăng nhập)
      const adminToken = localStorage.getItem("token");

      if (!adminToken) {
        throw new Error("Bạn cần đăng nhập với quyền admin");
      }

      const response = await fetch(`${BACKEND_URL}/admin/aircraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          manufacturer: aircraftData.manufacturer,
          model: aircraftData.model,
          // Tính tổng số ghế cho capacity
          capacity:
            aircraftData.seatConfiguration.economyClass +
            aircraftData.seatConfiguration.businessClass +
            aircraftData.seatConfiguration.firstClass,
          economy_seats: aircraftData.seatConfiguration.economyClass,
          business_seats: aircraftData.seatConfiguration.businessClass,
          first_seats: aircraftData.seatConfiguration.firstClass,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Lỗi khi thêm máy bay");
      }
      const result = await response.text();
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi thêm máy bay"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("seatConfiguration.")) {
      const seatType = name.split(".")[1];
      setNewAircraft((prevState) => ({
        ...prevState,
        seatConfiguration: {
          ...prevState.seatConfiguration,
          [seatType]: value === "" ? 0 : Number(value),
        },
      }));
    } else {
      setNewAircraft((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addAircraft = async () => {
    try {
      setError("");
      const { manufacturer, model } = newAircraft;
      const { economyClass, businessClass, firstClass } =
        newAircraft.seatConfiguration;

      if (!manufacturer || !model) {
        setError("Vui lòng điền đầy đủ thông tin máy bay");
        return;
      }

      if (economyClass < 0 || businessClass < 0 || firstClass < 0) {
        setError("Số ghế không được âm");
        return;
      }

      if (economyClass + businessClass + firstClass === 0) {
        setError("Tổng số ghế phải lớn hơn 0");
        return;
      } // Gọi API để thêm máy bay
      const result = await addAircraftToServer(newAircraft);

      // Thêm vào state local với ID từ response
      // Giả sử response trả về dạng "...aircraft_id là X"
      const aircraftId = parseInt(result.split("là ").pop() || "0");

      const aircraftWithId = {
        ...newAircraft,
        id: aircraftId,
      };

      setAircrafts((prevState) => [...prevState, aircraftWithId]);

      // Reset form
      setNewAircraft({
        manufacturer: "",
        model: "",
        yearManufactured: new Date().getFullYear(),
        seatConfiguration: {
          economyClass: 0,
          businessClass: 0,
          firstClass: 0,
        },
      });

      alert(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const viewAircraft = (aircraft: Aircraft) => {
    setSelectedAircraft(aircraft);
  };

  // Check model để remove
  const removeAircraft = (aircraft: Aircraft) => {
    setAircrafts((prevState) => prevState.filter((a) => a.id !== aircraft.id));

    if (selectedAircraft?.id === aircraft.id) {
      setSelectedAircraft(null);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}
        <section className={styles.inputSection}>
          <h2>Add New Aircraft</h2>
          <form
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault();
              addAircraft();
            }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="manufacturer">Manufacturer</label>
              <input
                id="manufacturer"
                type="text"
                name="manufacturer"
                placeholder="Enter manufacturer name"
                value={newAircraft.manufacturer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="model">Model</label>
              <input
                id="model"
                type="text"
                name="model"
                placeholder="Enter model"
                value={newAircraft.model}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="yearManufactured">Year Manufactured</label>
              <input
                id="yearManufactured"
                type="number"
                name="yearManufactured"
                placeholder="Production year"
                value={newAircraft.yearManufactured}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                <h3>Seat Configuration:</h3>
              </label>
              <div className={styles.seatInputs}>
                <div className={styles.seatInputGroup}>
                  <label htmlFor="economyClass">Economy Class</label>
                  <input
                    id="economyClass"
                    type="number"
                    name="seatConfiguration.economyClass"
                    placeholder="Number of economy seats"
                    value={newAircraft.seatConfiguration.economyClass}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className={styles.seatInputGroup}>
                  <label htmlFor="businessClass">Business Class</label>
                  <input
                    id="businessClass"
                    type="number"
                    name="seatConfiguration.businessClass"
                    placeholder="Number of business seats"
                    value={newAircraft.seatConfiguration.businessClass}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className={styles.seatInputGroup}>
                  <label htmlFor="firstClass">First Class</label>
                  <input
                    id="firstClass"
                    type="number"
                    name="seatConfiguration.firstClass"
                    placeholder="Number of first class seats"
                    value={newAircraft.seatConfiguration.firstClass}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
            <button type="submit" className={styles.submitButton}>
              Add Aircraft
            </button>
          </form>
        </section>

        <section className={styles.aircraftSection}>
          <h2>Aircraft Fleet</h2>
          <div className={styles.aircraftList}>
            {aircrafts.length === 0 ? (
              <p>No aircraft added yet.</p>
            ) : (
              aircrafts.map((aircraft) => (
                <div key={aircraft.id} className={styles.aircraftItem}>
                  <div className={styles.aircraftInfo}>
                    <h3>
                      {aircraft.manufacturer} {aircraft.model}
                    </h3>
                    <p>
                      <strong>Year:</strong> {aircraft.yearManufactured}
                    </p>
                  </div>
                  <div className={styles.aircraftActions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => viewAircraft(aircraft)}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeAircraft(aircraft)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {selectedAircraft && (
        <div className={styles.aircraftDetailsModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>
                {selectedAircraft.manufacturer} {selectedAircraft.model}
              </h2>
              <button
                className={styles.closeModalButton}
                onClick={() => setSelectedAircraft(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalDetailsGrid}>
              <div className={styles.modalDetailItem}>
                <strong>Year Manufactured:</strong>
                <span>{selectedAircraft.yearManufactured}</span>
              </div>
            </div>

            <h3>Seat Configuration</h3>
            <div className={styles.seatDetailsGrid}>
              <div className={styles.seatDetailItem}>
                <strong>Economy Class:</strong>
                <span>{selectedAircraft.seatConfiguration.economyClass}</span>
              </div>
              <div className={styles.seatDetailItem}>
                <strong>Business Class:</strong>
                <span>{selectedAircraft.seatConfiguration.businessClass}</span>
              </div>
              <div className={styles.seatDetailItem}>
                <strong>First Class:</strong>
                <span>{selectedAircraft.seatConfiguration.firstClass}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftManagement;

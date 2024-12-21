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

  const addAircraft = () => {
    const { manufacturer, model } = newAircraft;
    const { economyClass, businessClass, firstClass } =
      newAircraft.seatConfiguration;

    if (
      manufacturer &&
      model &&
      economyClass >= 0 &&
      businessClass >= 0 &&
      firstClass >= 0
    ) {
      // Thêm id vào máy bay mới
      const aircraftWithId = {
        ...newAircraft,
        id: nextId,
      };

      setAircrafts((prevState) => [...prevState, aircraftWithId]);
      setNextId(nextId + 1); // Tăng id cho lần thêm tiếp theo

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
    } else {
      alert(
        "Please fill in all required fields and ensure seat numbers are non-negative."
      );
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

"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";
import styles from './BookingConfirmation.module.css';

interface FlightDetails {
    stops: number;
    totalDuration: string;
    departure: {
        airportCode: string;
        city: string;
        time: string;
        date: string;
    };
    arrival: {
        airportCode: string;
        city: string;
        time: string;
        date: string;
    };
    flights: {
        airline: string;
        flightNumber: string;
    }[];
    pricing: {
        [key: string]: {
            price: number;
            currency: string;
        }
    }
}

const BookingConfirmation: React.FC = () => {
    const { locale } = useContext(LanguageContext);
    // Chọn bản dịch dựa trên ngôn ngữ hiện tại
    const translations = locale === "en" ? en.bookingConfirm : vi.bookingConfirm;

    const router = useRouter();
    const searchParams = useSearchParams();

    // State cho form thông tin khách hàng
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // State cho thông tin chuyến bay
    const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(null);
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        // Lấy thông tin từ trạng thái điều hướng
        const flightData = searchParams.get('flightDetails');
        const selectedClassData = searchParams.get('selectedClass');

        if (flightData) {
            setFlightDetails(JSON.parse(flightData));
        }
        if (selectedClassData) {
            setSelectedClass(selectedClassData);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý logic đặt vé
        alert('Booking submitted successfully!');
        // Có thể thêm logic chuyển trang hoặc gửi API
    };

    if (!flightDetails) return <div>{translations.loading}</div>;

    return (
        <div className={styles.bookingContainer}>
            <h1>
                {translations.confirm_booking}
            </h1>

            {/* Thông tin chuyến bay */}
            <div className={styles.flightSummary}>
                <h2>
                    {translations.flight_details}
                </h2>
                <p>{translations.airline}: {flightDetails.flights[0].airline}</p>
                <p>{translations.flight_number}: {flightDetails.flights[0].flightNumber}</p>
                <p>{translations.departure_city}: {flightDetails.departure.city} ({flightDetails.departure.airportCode})</p>
                <p>{translations.arrival_city}: {flightDetails.arrival.city} ({flightDetails.arrival.airportCode})</p>
                <p>{translations.total_duration}: {flightDetails.totalDuration}</p>
                <p>{translations.ticket_class}: {selectedClass}</p>
            </div>

            {/* Form đăng ký thông tin */}
            <form onSubmit={handleSubmit} className={styles.bookingForm}>
                <div className={styles.formGroup}>
                    <label>{translations.full_name}</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{translations.date_of_birth}</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{translations.id_number}</label>
                    <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{translations.nationality}</label>
                    <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{translations.email}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{translations.phone_number}</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    {translations.submit_booking}
                </button>
            </form>
        </div>
    );
};

export default BookingConfirmation;
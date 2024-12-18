import React from "react";
import styles from "./page.module.css";
import BookingConfirmation from "@/app/components/SearchFlights/BookingConfirmation/BookingConfirmation";

const BookingConfirm = () => {
    return (
        <div className={styles.container}>
            <BookingConfirmation />
        </div>
    );
};

export default BookingConfirm;

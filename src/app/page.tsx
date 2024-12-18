import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/HomePage/Header/Header";
import FlightSuggestions from "./components/HomePage/FlightSuggestions/FlightSuggestions";
import Questions from "./components/HomePage/Questions/Questions";

export default function Home() {
  return (
    <>
      <Header />
      <FlightSuggestions />
      <Questions />
    </>
  );
}

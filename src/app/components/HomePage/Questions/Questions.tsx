"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./Questions.module.css";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQData {
  faqs: FAQ[];
}

const INITIAL_VISIBLE_COUNT = 3;

const Questions: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [loading, setLoading] = useState(true);

  const { locale } = useContext(LanguageContext);
  // Chọn bản dịch dựa trên ngôn ngữ hiện tại
  const translations = locale === "en" ? en.FAQs : vi.FAQs;

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`/data/faq/faq_${locale}.json`);
        const data: FAQData = await response.json();
        setFaqs(data.faqs);
        setLoading(false);
      } catch (error) {
        console.error("Error loading FAQs:", error);
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [locale]);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, faqs.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    const container = document.getElementById("faqContainer");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{translations.title}</h1>
        <div id="faqContainer" className={styles.faqItems}>
          {faqs.slice(0, visibleCount).map((item, index) => (
            <div key={item.id} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${
                  openIndex === index ? styles.active : ""
                }`}
                onClick={() => toggleAnswer(index)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.arrow}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`${styles.faqAnswer} ${
                  openIndex === index ? styles.open : ""
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          {visibleCount < faqs.length ? (
            <button className={styles.viewMoreButton} onClick={handleViewMore}>
              {translations.moreButton}
            </button>
          ) : (
            visibleCount > INITIAL_VISIBLE_COUNT && (
              <button
                className={styles.showLessButton}
                onClick={handleShowLess}
              >
                {translations.lessButton}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;

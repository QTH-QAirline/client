"use client";
import React, { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { LanguageContext } from "../../../utils/LanguageContext";
import { en, vi } from "../../../utils/locales";

const Footer = () => {
  const pathname = usePathname();
  const { locale } = useContext(LanguageContext);
  // Chọn bản dịch dựa trên ngôn ngữ hiện tại
  const translations = locale === "en" ? en.footer : vi.footer;

  if (
    pathname.startsWith("/admin") ||
    pathname == "/login" ||
    pathname == "/signup"
  ) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.logoSection}>
            <h2 className={styles.logoText}>QAirline</h2>
            <p className={styles.tagline}>{translations.tagline}</p>
          </div>

          <div className={styles.linkColumns}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{translations.quickLinks}</h3>
              <ul className={styles.linkList}>
                <li>
                  <a href="/">{translations.home}</a>
                </li>
                <li>
                  <a href="/my-flights">{translations.myFlights}</a>
                </li>
                <li>
                  <a href="#">{translations.booking}</a>
                </li>
                <li>
                  <a href="#">{translations.checkin}</a>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>
                {translations.customerService}
              </h3>
              <ul className={styles.linkList}>
                <li>
                  <a href="#">{translations.helpCenter}</a>
                </li>
                <li>
                  <a href="#">{translations.contactUs}</a>
                </li>
                <li>
                  <a href="#">{translations.baggagePolicy}</a>
                </li>
                <li>
                  <a href="#">{translations.faq}</a>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{translations.legal}</h3>
              <ul className={styles.linkList}>
                <li>
                  <a href="#">{translations.privacyPolicy}</a>
                </li>
                <li>
                  <a href="#">{translations.termsOfService}</a>
                </li>
                <li>
                  <a href="#">{translations.refundPolicy}</a>
                </li>
                <li>
                  <a href="#">{translations.cookiesSettings}</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.columnTitle}>
              {translations.contactInformation}
            </h3>
            <p>{translations.customerSupport}: +84 123 456 789</p>
            <p>Email: support@qairline.com</p>

            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Twitter size={24} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; 2024 QAriline. {translations.allRightsReserved}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

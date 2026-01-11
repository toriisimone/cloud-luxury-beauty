import { useState } from 'react';
import styles from './TopAnnouncementBanner.module.css';

const TopAnnouncementBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Free U.S. shipping with orders over $40',
    'New arrivals: Cloud Glow Collection',
    'Subscribe & save 15% on your first order',
  ];

  if (isDismissed) {
    return null;
  }

  const handlePrevious = () => {
    setMessageIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  const handleClose = () => {
    setIsDismissed(true);
  };

  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <button 
          className={styles.arrowButton}
          onClick={handlePrevious}
          aria-label="Previous message"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.75 10.5L5.25 7L8.75 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={styles.messageContainer}>
          <span className={styles.message}>{messages[messageIndex]}</span>
        </div>

        <button 
          className={styles.arrowButton}
          onClick={handleNext}
          aria-label="Next message"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close banner"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopAnnouncementBanner;

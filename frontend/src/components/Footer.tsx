import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup
    console.log('Email signup:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Email Signup Section */}
        <div className={styles.emailSignup}>
          <h3 className={styles.signupTitle}>Join the Cloud</h3>
          <p className={styles.signupSubtitle}>Get exclusive offers and beauty tips delivered to your inbox</p>
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.signupButton}>
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Links Grid - Glossier style */}
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>How can we help?</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/returns">Returns & Exchanges</Link>
            <Link to="/faq">Help & FAQ</Link>
            <Link to="/student-discount">Student Discount</Link>
            <Link to="/international">International</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>About AURAPOP</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/affiliates">Affiliates</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Stores</h4>
            <Link to="/locations">Find your store</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Social</h4>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
        </div>


        {/* Legal Links */}
        <div className={styles.legalLinks}>
          <p>&copy; 2024 AURAPOP. All rights reserved.</p>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/privacy-choices">Your Privacy Choices</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

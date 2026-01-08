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

        {/* Footer Links */}
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?featured=true">Featured</Link>
            <Link to="/products?category=Lips">Lips</Link>
            <Link to="/products?category=Face">Face</Link>
            <Link to="/products?category=Fragrance">Fragrance</Link>
            <Link to="/products?category=Skincare">Skincare</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Customer Service</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/shipping">Shipping</Link>
            <Link to="/tracking">Order Tracking</Link>
            <Link to="/returns">Returns & Exchanges</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Account</h4>
            <Link to="/account">My Account</Link>
            <Link to="/rewards">Rewards</Link>
            <Link to="/gift-card">Gift Card Balance</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/orders">Order History</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Twitter
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className={styles.legalLinks}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>

        {/* Copyright */}
        <div className={styles.bottom}>
          <p>&copy; 2024 Cloud Luxury Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

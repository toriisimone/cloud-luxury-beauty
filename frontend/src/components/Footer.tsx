import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.sections}>
          <div className={styles.section}>
            <h3>Cloud Luxury</h3>
            <p>Premium beauty products for a radiant you.</p>
          </div>
          
          <div className={styles.section}>
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/products?featured=true">Featured</Link>
          </div>
          
          <div className={styles.section}>
            <h4>Customer Service</h4>
            <Link to="/account">My Account</Link>
            <Link to="/cart">Shopping Cart</Link>
          </div>
          
          <div className={styles.section}>
            <h4>Connect</h4>
            <p>Follow us on social media</p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; 2024 Cloud Luxury Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

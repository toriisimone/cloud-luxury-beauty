import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Rotating banner messages
  const bannerMessages = [
    'Free standard shipping on orders $40+',
    'New arrivals: Cloud Glow Collection',
    'Subscribe & save 15% on your first order',
    'Limited edition: Rose Gold Essentials',
  ];

  // Rotate banner messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerMessages.length]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // SIMPLIFIED MENU: Only Home and Skincare
  const menuItems = [
    {
      name: 'SKINCARE',
      href: '/products/skincare',
    },
  ];

  return (
    <>
      {/* Rotating Top Banner */}
      <div className={styles.topBanner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerText}>{bannerMessages[bannerIndex]}</span>
          <div className={styles.bannerControls}>
            <button 
              className={styles.bannerArrow}
              onClick={() => setBannerIndex((prev) => (prev - 1 + bannerMessages.length) % bannerMessages.length)}
              aria-label="Previous banner"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={styles.bannerArrow}
              onClick={() => setBannerIndex((prev) => (prev + 1) % bannerMessages.length)}
              aria-label="Next banner"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.bannerPause} aria-label="Pause banner">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="2" height="8" fill="currentColor"/>
                <rect x="7" y="2" width="2" height="8" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo - Left */}
          <Link to="/" className={styles.logo}>
            AURAPOP.
          </Link>
          
          {/* Center Navigation */}
          <div className={styles.centerNav}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={styles.menuLink}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Right Side Icons */}
          <div className={styles.rightNav}>
            {/* Heart Icon - Wishlist */}
            <button className={styles.iconButton} aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 15.5L8.1 14.7C4.5 11.5 2 9.3 2 6.5C2 4.3 3.8 2.5 6 2.5C7.1 2.5 8.1 3 8.8 3.7L9 4L9.2 3.7C9.9 3 10.9 2.5 12 2.5C14.2 2.5 16 4.3 16 6.5C16 9.3 13.5 11.5 9.9 14.7L9 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            {/* Person Icon - Account */}
            <Link to="/account" className={styles.iconButton} aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M3 15C3 12.5 5.5 10.5 9 10.5C12.5 10.5 15 12.5 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </Link>
            {/* Search Icon - Magnifying Glass */}
            <button className={styles.iconButton} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            {/* Shopping Bag Icon - Cart */}
            <Link to="/cart" className={styles.iconButton} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5H14L13 11H5L4 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M6 7V4C6 2.9 6.9 2 8 2H10C11.1 2 12 2.9 12 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="7" cy="14" r="1" fill="currentColor"/>
                <circle cx="11" cy="14" r="1" fill="currentColor"/>
              </svg>
              {getItemCount() > 0 && (
                <span className={styles.cartBadge}>{getItemCount()}</span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={mobileMenuOpen ? styles.open : ''}></span>
              <span className={mobileMenuOpen ? styles.open : ''}></span>
              <span className={mobileMenuOpen ? styles.open : ''}></span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((item) => (
            <div key={item.name} className={styles.mobileMenuItem}>
              <Link 
                to={item.href} 
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;

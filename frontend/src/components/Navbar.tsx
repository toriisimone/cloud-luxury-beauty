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
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  // Rotating banner messages for black banner
  const bannerMessages = [
    'Check out only the best Amazon products',
    'Buy on Aurapop today',
    'Free standard shipping on orders $40+',
    'New arrivals: Cloud Glow Collection',
    'Subscribe & save 15% on your first order',
    'Limited edition: Rose Gold Essentials',
  ];

  // Rotate black banner messages every 10 seconds (very slow, readable)
  useEffect(() => {
    if (isBannerPaused) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bannerMessages.length, isBannerPaused]);

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
      {/* Rotating Top Banner - Pink with animated clouds */}
      <div className={styles.topBanner}>
        {/* Animated clouds/fog effect */}
        <div className={styles.bannerClouds}>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.bannerContent}>
          {/* Crossfade technique - always show text, no blank moments */}
          <div className={styles.bannerTextContainer}>
            {bannerMessages.map((message, index) => (
              <span
                key={index}
                className={`${styles.bannerText} ${index === bannerIndex ? styles.bannerTextActive : ''}`}
              >
                {message}
              </span>
            ))}
          </div>
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
            <button 
              className={styles.bannerPause} 
              onClick={() => setIsBannerPaused(!isBannerPaused)}
              aria-label={isBannerPaused ? "Play banner" : "Pause banner"}
            >
              {isBannerPaused ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2 L4 10 L10 6 Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="2" width="2" height="8" fill="currentColor"/>
                  <rect x="7" y="2" width="2" height="8" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`${styles.navbar} ${isNavbarHovered ? styles.navbarHovered : ''}`}
        onMouseEnter={() => setIsNavbarHovered(true)}
        onMouseLeave={() => setIsNavbarHovered(false)}
      >
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
            {/* Heart Icon - Wishlist - Kylie size */}
            <button className={styles.iconButton} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            {/* Person Icon - Account - Kylie size */}
            <Link to="/account" className={styles.iconButton} aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M6 20c0-3.33 2.67-6 6-6s6 2.67 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </Link>
            {/* Search Icon - Magnifying Glass - Kylie size */}
            <button className={styles.iconButton} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M17 17l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            {/* Shopping Bag Icon - Cart - New design based on reference */}
            <Link to="/cart" className={styles.iconButton} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Handbag body - trapezoidal, wider at base, tapering to top */}
                <path d="M7 10 L17 10 L18.5 18 L5.5 18 Z" fill="currentColor" stroke="none"/>
                {/* U-shaped handle - prominent handle extending upward */}
                <path d="M10 10 Q10 6 12 6 Q14 6 14 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Front flap/pocket - horizontal line with angled sides */}
                <path d="M8 14 L16 14 L15.5 16 L8.5 16 Z" fill="currentColor" stroke="none" opacity="0.3"/>
                {/* Side protrusions - ear-like on left and right */}
                <ellipse cx="6.5" cy="11" rx="1" ry="1.5" fill="currentColor"/>
                <ellipse cx="17.5" cy="11" rx="1" ry="1.5" fill="currentColor"/>
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

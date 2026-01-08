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

  const menuItems = [
    {
      name: 'SKINCARE',
      href: '/products?category=Skincare',
    },
    {
      name: 'MAKEUP',
      href: '/products?category=Makeup',
    },
    {
      name: 'BALMS',
      href: '/products?category=Balms',
    },
    {
      name: 'BODY',
      href: '/products?category=Body',
    },
    {
      name: 'FRAGRANCE',
      href: '/products?category=Fragrance',
    },
    {
      name: 'SETS',
      href: '/products?category=Sets',
    },
    {
      name: 'SHOP ALL',
      href: '/products',
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
            <button className={styles.iconButton} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
              </svg>
            </button>
            <button className={styles.iconButton} aria-label="Region">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 1C9 1 12 4 12 6C12 8 10.5 9 9 9C7.5 9 6 8 6 6C6 4 9 1 9 1Z" fill="currentColor"/>
              </svg>
            </button>
            <div className={styles.countrySelector}>US</div>
            {isAuthenticated ? (
              <Link to="/account" className={styles.navLink}>LOG IN</Link>
            ) : (
              <Link to="/account" className={styles.navLink}>LOG IN</Link>
            )}
            <Link to="/cart" className={styles.cartLink}>
              BAG ({getItemCount()})
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

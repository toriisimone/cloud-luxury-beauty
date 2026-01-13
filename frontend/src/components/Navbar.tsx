import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getCategoryStructure, TopCategory } from '../data/productData';
import MegaMenu from './MegaMenu';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);

  // Single static banner message - no rotation
  const bannerMessage = 'New arrivals: Cloud Glow Collection • Subscribe & save 15% on your first order • Limited edition: Rose Gold Essentials';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get menu items from category structure
  const categories = getCategoryStructure();
  const menuItems = categories.map(cat => ({
    name: cat.topCategory.toUpperCase(),
    href: `/category/${cat.topCategory.toLowerCase().replace(/\s+/g, '-')}`,
    category: cat.topCategory
  }));

  return (
    <>
      {/* Static Top Banner - Pink with centered text matching menu alignment */}
      <div className={styles.topBanner}>
        {/* Animated clouds/fog effect */}
        <div className={styles.bannerClouds}>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.bannerContent}>
          {/* Single static message - centered to match menu alignment */}
          <div className={styles.bannerTextContainer}>
            <span className={styles.bannerText}>
              {bannerMessage}
            </span>
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
              <div
                key={item.name}
                className={styles.menuItemWrapper}
                onMouseEnter={() => {
                  setHoveredCategory(item.category);
                  setMegaMenuOpen(true);
                }}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                  setMegaMenuOpen(false);
                }}
              >
                <Link
                  to={item.href}
                  className={styles.menuLink}
                >
                  {item.name}
                </Link>
              </div>
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
            {/* Shopping Bag Icon - Cart - Luxury handbag with handles matching other icons */}
            <Link to="/cart" className={styles.iconButton} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Handbag body - square/trapezoid bag */}
                <path d="M6 9L4 20H20L18 9H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Top opening/flap */}
                <path d="M4 9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Left handle - curved */}
                <path d="M6 9C6 8 6.5 7 7.5 7C8.5 7 9 8 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Right handle - curved */}
                <path d="M15 9C15 8 15.5 7 16.5 7C17.5 7 18 8 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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

      {/* Mega Menu */}
      <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
    </>
  );
};

export default Navbar;

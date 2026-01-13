import { useState, useEffect, useRef } from 'react';
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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Single static banner message
  const bannerMessage = 'New arrivals: Cloud Glow Collection • Subscribe & save 15% on your first order • Limited edition: Rose Gold Essentials';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Get menu items from category structure
  const categories = getCategoryStructure();
  const menuItems = categories.map(cat => ({
    name: cat.topCategory,
    href: `/category/${cat.topCategory.toLowerCase().replace(/\s+/g, '-')}`,
    category: cat.topCategory
  }));

  return (
    <>
      {/* Static Top Banner - Pink with centered text */}
      <div className={styles.topBanner}>
        <div className={styles.bannerClouds}>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTextContainer}>
            <span className={styles.bannerText}>
              {bannerMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header - Kylie's Exact Structure */}
      <header className={styles.layoutHeader} data-vue="header">
        <div className={styles.siteHeader}>
          <div className={styles.siteHeaderWrapper}>
            {/* Logo - Center */}
            <div className={styles.siteHeaderLogo}>
              <h1 className={styles.siteLogo}>
                <Link to="/" rel="follow" title="AURAPOP home page">
                  AURAPOP.
                </Link>
              </h1>
            </div>

            {/* Navigation - Desktop Menu */}
            <div className={styles.siteHeaderNavigation}>
              <div className={styles.siteHeaderMenu}>
                <nav 
                  id="Linklist-main-menu" 
                  className={styles.linklist} 
                  aria-label="Main [Desktop]"
                  data-handle="main-menu"
                  data-levels="3"
                  data-title="Main [Desktop]"
                >
                  <ul className={styles.linklistLinks}>
                    {menuItems.map((item) => (
                      <li
                        key={item.name}
                        className={styles.link}
                        data-level="1"
                        data-levels="2"
                        data-title={item.name}
                        data-type="collection_link"
                        data-url={item.href}
                        onMouseEnter={() => {
                          if (closeTimeoutRef.current) {
                            clearTimeout(closeTimeoutRef.current);
                            closeTimeoutRef.current = null;
                          }
                          setHoveredCategory(item.category);
                          setMegaMenuOpen(true);
                        }}
                        onMouseLeave={() => {
                          closeTimeoutRef.current = setTimeout(() => {
                            setHoveredCategory(null);
                            setMegaMenuOpen(false);
                          }, 200);
                        }}
                      >
                        <Link
                          to={item.href}
                          rel="follow"
                          className={styles.linkAnchor}
                          role="button"
                          aria-haspopup="true"
                          aria-expanded={megaMenuOpen && hoveredCategory === item.category}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Utilities - Icons */}
            <div className={styles.siteHeaderUtilities}>
              {/* Mobile Menu Toggle */}
              <div className={styles.siteHeaderUtilitiesMenu}>
                <button
                  className={styles.siteHeaderAction}
                  title="Main Menu"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Desktop Utilities */}
              <div className={styles.siteHeaderUtilitiesDesktop}>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className={styles.siteHeaderAction}
                  title="Wishlist"
                  aria-label="Product Added in Wishlist"
                  rel="nofollow"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </Link>
                {/* Account */}
                <Link
                  to="/account"
                  className={styles.siteHeaderAction}
                  title="Account"
                  aria-label="Account Login"
                  rel="nofollow"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M6 20c0-3.33 2.67-6 6-6s6 2.67 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </Link>
                {/* Search */}
                <Link
                  to="/search"
                  className={styles.siteHeaderAction}
                  title="Search"
                  rel="nofollow"
                  role="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M17 17l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </Link>
                {/* Cart Group */}
                <div className={styles.siteHeaderActionGroup}>
                  <Link
                    to="/wishlist"
                    className={`${styles.siteHeaderAction} ${styles.siteHeaderActionWishlistMobile}`}
                    title="Wishlist"
                    aria-label="Product Added in Wishlist"
                    rel="nofollow"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </Link>
                  <Link
                    to="/cart"
                    className={styles.siteHeaderAction}
                    title="cart"
                    rel="nofollow"
                    role="button"
                    aria-label={`${getItemCount()} items in cart`}
                    data-cart-count={getItemCount()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L4 20H20L18 9H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M4 9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9C6 8 6.5 7 7.5 7C8.5 7 9 8 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M15 9C15 8 15.5 7 16.5 7C17.5 7 18 8 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    {getItemCount() > 0 && (
                      <span className={styles.cartBadge}>{getItemCount()}</span>
                    )}
                    <span className={styles.visuallyHidden}>Cart with {getItemCount()} items</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
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
      <MegaMenu 
        isOpen={megaMenuOpen} 
        activeCategory={hoveredCategory}
        onClose={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
          }
          setMegaMenuOpen(false);
          setHoveredCategory(null);
        }}
        onMouseEnter={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
          }
        }}
        onMouseLeave={() => {
          closeTimeoutRef.current = setTimeout(() => {
            setMegaMenuOpen(false);
            setHoveredCategory(null);
          }, 200);
        }}
      />
    </>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Skincare',
      href: '/products?category=Skincare',
    },
    {
      name: 'Makeup',
      href: '/products?category=Makeup',
    },
    {
      name: 'Body',
      href: '/products?category=Body',
    },
    {
      name: 'Fragrance',
      href: '/products?category=Fragrance',
    },
    {
      name: 'Balms',
      href: '/products?category=Balms',
    },
    {
      name: 'Sets',
      href: '/products?category=Sets',
    },
    {
      name: 'Shop All',
      href: '/products',
    },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo - Top Left */}
        <Link to="/" className={styles.logo} onMouseEnter={() => setActiveMenu(null)}>
          AURAPOP
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
          <div className={styles.countrySelector}>US</div>
          <button className={styles.iconButton} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
            </svg>
          </button>
          {isAuthenticated ? (
            <Link to="/account" className={styles.navLink}>Sign In</Link>
          ) : (
            <Link to="/account" className={styles.navLink}>Sign In</Link>
          )}
          <Link to="/cart" className={styles.cartLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="currentColor"/>
              <path d="M16 18C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16C15.4477 16 15 16.4477 15 17C15 17.5523 15.4477 18 16 18Z" fill="currentColor"/>
              <path d="M0 1H2L2.4 3H18L16 11H5.6L6 13H17V15H5C4.44772 15 4 14.5523 4 14C4 13.4477 4.44772 13 5 13H5.2L4.8 11H2.8L1.2 3H0V1Z" fill="currentColor"/>
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
    </nav>
  );
};

export default Navbar;

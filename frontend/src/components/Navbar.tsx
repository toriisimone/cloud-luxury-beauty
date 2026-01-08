import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Cosmetics',
      subcategories: [
        { name: 'Lips', href: '/products?category=Lips' },
        { name: 'Face', href: '/products?category=Face' },
        { name: 'Eyes', href: '/products?category=Eyes' },
        { name: 'Cheeks', href: '/products?category=Cheeks' },
        { name: 'Brushes', href: '/products?category=Brushes' },
      ],
    },
    {
      name: 'Fragrance',
      subcategories: [
        { name: 'Perfume', href: '/products?category=Fragrance' },
        { name: 'Body Mist', href: '/products?category=Body Mist' },
        { name: 'Candles', href: '/products?category=Candles' },
      ],
    },
    {
      name: 'Skin',
      subcategories: [
        { name: 'Skincare', href: '/products?category=Skincare' },
        { name: 'Face Oils', href: '/products?category=Face Oils' },
        { name: 'Serums', href: '/products?category=Serums' },
        { name: 'Moisturizers', href: '/products?category=Moisturizers' },
      ],
    },
    {
      name: 'Discover',
      subcategories: [
        { name: 'New Arrivals', href: '/products?featured=true' },
        { name: 'Best Sellers', href: '/products?featured=true' },
        { name: 'Limited Edition', href: '/products?category=Limited Edition' },
      ],
    },
    {
      name: 'Rewards',
      href: '/rewards',
    },
    {
      name: 'Gift Guide',
      href: '/gift-guide',
    },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onMouseEnter={() => setActiveMenu(null)}>
          CLOUD LUXURY
        </Link>
        
        <div className={styles.navLinks}>
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={styles.menuItem}
              onMouseEnter={() => setActiveMenu(item.name)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {item.href ? (
                <Link to={item.href} className={styles.menuLink}>
                  {item.name}
                </Link>
              ) : (
                <span className={styles.menuLink}>{item.name}</span>
              )}
              
              {item.subcategories && activeMenu === item.name && (
                <div className={styles.megaMenu}>
                  <div className={styles.megaMenuContent}>
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className={styles.subcategoryLink}
                        onClick={() => setActiveMenu(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link to="/account" className={styles.navLink}>Account</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={styles.navLink}>Admin</Link>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/account" className={styles.navLink}>Login</Link>
          )}
          
          <Link to="/cart" className={styles.cartLink}>
            <span className={styles.cartIcon}>🛒</span>
            {getItemCount() > 0 && (
              <span className={styles.cartBadge}>{getItemCount()}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

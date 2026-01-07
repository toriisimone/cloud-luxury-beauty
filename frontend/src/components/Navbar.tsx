import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          CLOUD LUXURY
        </Link>
        
        <div className={styles.navLinks}>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          {isAuthenticated ? (
            <>
              <Link to="/account">Account</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin">Admin</Link>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/account">Login</Link>
          )}
          <Link to="/cart" className={styles.cartLink}>
            Cart ({getItemCount()})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

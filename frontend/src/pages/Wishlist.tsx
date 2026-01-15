import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import * as usersApi from '../api/usersApi';
import { Product } from '../types/global';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refresh } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const items = await usersApi.getWishlist();
        setProducts(items.map((i) => i.product));
      } catch (e) {
        console.error('[Wishlist] Failed to load wishlist:', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isAuthenticated]);

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Wishlist</h1>
          <button
            type="button"
            className={styles.refresh}
            onClick={async () => {
              setLoading(true);
              try {
                await refresh();
                const items = await usersApi.getWishlist();
                setProducts(items.map((i) => i.product));
              } finally {
                setLoading(false);
              }
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No favorites yet.</div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;


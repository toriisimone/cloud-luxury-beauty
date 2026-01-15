import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useWishlist } from '../hooks/useWishlist';
import * as usersApi from '../api/usersApi';
import * as productsApi from '../api/productsApi';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { wishlistIds, refresh, guestPromptOpen, dismissGuestPrompt, toggleWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const items = await usersApi.getWishlist();
          setProducts(items.map((i) => i.product));
        } else {
          // Guest wishlist: resolve ids to products via API
          const ids = Array.from(wishlistIds);
          const fetched = await Promise.all(ids.map((id) => productsApi.getProductById(id).catch(() => null)));
          setProducts(fetched.filter((p): p is Product => !!p));
        }
      } catch (e) {
        console.error('[Wishlist] Failed to load wishlist:', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isAuthenticated, wishlistIds]);

  const total = useMemo(() => products.reduce((sum, p) => sum + p.price, 0), [products]);

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>WISHLIST</h1>

        {loading ? (
          <Loader />
        ) : (
          <>
            {products.length === 0 ? (
              <div className={styles.emptyWrap}>
                <div className={styles.emptyText}>Seems like you have no items on your wishlist yet!</div>
                <Link to="/products" className={styles.primaryBtn}>
                  continue shopping
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  {products.map((p) => (
                    <div key={p.id} className={styles.itemRow}>
                      <div className={styles.itemCard}>
                        <div className={styles.itemImageWrap}>
                          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className={styles.itemImage} /> : null}
                        </div>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName}>{p.name}</div>
                          <div className={styles.itemShade}>{(p.description || '').toLowerCase()}</div>
                          <button
                            type="button"
                            className={styles.addBtn}
                            onClick={() => addItem(p, undefined, 1)}
                          >
                            add - ${p.price.toFixed(0)}
                          </button>
                          <button
                            type="button"
                            className={styles.removeLink}
                            onClick={() => void toggleWishlist(p.id)}
                          >
                            remove from wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.addAllBtn}
                  onClick={() => {
                    products.forEach((p) => addItem(p, undefined, 1));
                  }}
                >
                  add all items to cart - ${total.toFixed(0)}
                </button>
              </>
            )}

            {guestPromptOpen && !isAuthenticated && (
              <div className={styles.promptBackdrop} onClick={dismissGuestPrompt} role="dialog" aria-modal="true">
                <div className={styles.prompt} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.promptTitle}>You’ve added 5 favorites!</div>
                  <div className={styles.promptText}>
                    Sign in to save your wishlist and unlock more features.
                  </div>
                  <div className={styles.promptActions}>
                    <Link to="/account" className={styles.primaryBtn} onClick={dismissGuestPrompt}>
                      sign in
                    </Link>
                    <button type="button" className={styles.secondaryBtn} onClick={dismissGuestPrompt}>
                      not now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;


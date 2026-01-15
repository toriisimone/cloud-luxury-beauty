import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCartDrawer } from '../context/CartDrawerContext';
import styles from './CartDrawer.module.css';

const FREE_SHIPPING_THRESHOLD = 40;
const FREE_GIFT_THRESHOLD = 55;

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart();
  const { isOpen, close, lastAdded } = useCartDrawer();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const total = getTotal();
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const giftRemaining = Math.max(0, FREE_GIFT_THRESHOLD - total);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const headerLabel = useMemo(() => `cart ${getItemCount()} ${getItemCount() === 1 ? 'item' : 'items'}`, [getItemCount]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Cart"
      onMouseDown={(e) => {
        if (e.target === panelRef.current) close();
      }}
      ref={panelRef}
    >
      <div className={styles.panel}>
        <div className={styles.topRow}>
          <div className={styles.topTitle}>{headerLabel}</div>
          <button type="button" className={styles.close} onClick={close} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className={styles.shippingMsg}>
          you are ${shippingRemaining.toFixed(0)} away from free shipping!
        </div>

        <div className={styles.promo}>
          <div className={styles.promoTitle}>
            free travel accessory gift! <span className={styles.promoHeart}>💕</span>
          </div>
          <div className={styles.promoSub}>online exclusive and limited time only.</div>
          <div className={styles.promoOptions}>
            <div className={styles.promoOption}>compact mirror</div>
            <div className={styles.promoOption}>cosmic t</div>
          </div>
          <div className={styles.promoFooter}>spend another ${giftRemaining.toFixed(0)} and select 1 free gift(s)</div>
        </div>

        {lastAdded && (
          <div className={styles.added}>
            <div className={styles.addedTitle}>added to cart</div>
            <div className={styles.addedRow}>
              {lastAdded.product.images?.[0] ? (
                <img className={styles.addedImg} src={lastAdded.product.images[0]} alt={lastAdded.product.name} />
              ) : (
                <div className={styles.addedImgPlaceholder} />
              )}
              <div className={styles.addedInfo}>
                <div className={styles.addedName}>{lastAdded.product.name}</div>
                {lastAdded.variant?.name && (
                  <div className={styles.addedVariant}>
                    {lastAdded.variant.name}: {lastAdded.variant.value}
                  </div>
                )}
                <div className={styles.addedMeta}>
                  ${((lastAdded.variant?.price || lastAdded.product.price) * lastAdded.quantity).toFixed(2)} · qty {lastAdded.quantity}
                </div>
              </div>
            </div>
            <div className={styles.addedActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  close();
                  navigate('/cart');
                }}
              >
                view cart
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={close}>
                continue shopping
              </button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyText}>
              your cart is empty, get started with recommend products below or{' '}
              <button type="button" className={styles.inlineLink} onClick={close}>
                continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    {item.product?.images?.[0] ? (
                      <img className={styles.itemImg} src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div className={styles.itemImgPlaceholder} />
                    )}
                  </div>
                  <div className={styles.itemMid}>
                    <div className={styles.itemName}>
                      {item.product?.name} - ${(item.variant?.price || item.product?.price || 0).toFixed(0)}
                    </div>
                    <div className={styles.itemVariant}>{item.variant?.value || ''}</div>
                    <button type="button" className={styles.removeLink} onClick={() => removeItem(item.id)}>
                      remove
                    </button>
                  </div>
                  <div className={styles.qty}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <div className={styles.qtyVal}>{item.quantity}</div>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.rewards}>
              <span className={styles.rewardsLabel}>kylie rewards</span>{' '}
              <Link to="/account" className={styles.rewardsLink} onClick={close}>
                log in
              </Link>{' '}
              to earn {Math.max(1, Math.round(total))} points with this purchase
            </div>

            <div className={styles.totalRow}>
              <div>
                <div className={styles.totalLabel}>estimated total:</div>
                <div className={styles.totalSub}>shipping &amp; discounts calculated at checkout</div>
              </div>
              <div className={styles.totalVal}>${total.toFixed(0)}</div>
            </div>

            <button type="button" className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
              checkout
            </button>
          </>
        )}

        <div className={styles.beforeYouGo}>
          <div className={styles.beforeTitle}>before you go…</div>
          <div className={styles.recoCard}>
            <div className={styles.recoImgPlaceholder} />
            <div className={styles.recoInfo}>
              <div className={styles.recoName}>lip butter</div>
              <div className={styles.recoDesc}>instantly quenches dry, chapped lips in silky moisture for up to 24 hours.</div>
            </div>
            <button type="button" className={styles.recoBtn} onClick={() => navigate('/products')}>
              choose shade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;


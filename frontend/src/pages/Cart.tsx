import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import styles from './Cart.module.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>cart 0 items</div>
            <div className={styles.shippingMsg}>you are $40 away from free shipping!</div>
          </div>

          <div className={styles.promo}>
            <div className={styles.promoTitle}>free travel accessory gift!</div>
            <div className={styles.promoSub}>online exclusive and limited time only.</div>
            <div className={styles.promoOptions}>
              <div className={styles.promoOption}>compact mirror</div>
              <div className={styles.promoOption}>cosmic t</div>
            </div>
            <div className={styles.promoFooter}>spend another $55 and select 1 free gift(s)</div>
          </div>

          <div className={styles.emptyBlock}>
            <div className={styles.emptyText}>
              your cart is empty, get started with recommend products below or{' '}
              <button type="button" className={styles.inlineLink} onClick={() => navigate('/products')}>
                continue shopping
              </button>
            </div>
          </div>

          <div className={styles.beforeYouGo}>
            <div className={styles.beforeTitle}>before you go…</div>
            <div className={styles.recoCard}>
              <div className={styles.recoImgPlaceholder} />
              <div className={styles.recoInfo}>
                <div className={styles.recoName}>lip butter</div>
                <div className={styles.recoDesc}>
                  instantly quenches dry, chapped lips in silky moisture for up to 24 hours.
                </div>
              </div>
              <button type="button" className={styles.recoBtn} onClick={() => navigate('/products')}>
                choose shade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shippingRemaining = Math.max(0, 40 - total);
  const giftRemaining = Math.max(0, 55 - total);

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            cart {items.reduce((n, i) => n + i.quantity, 0)} {items.reduce((n, i) => n + i.quantity, 0) === 1 ? 'item' : 'items'}
          </div>
          <div className={styles.shippingMsg}>you are ${shippingRemaining.toFixed(0)} away from free shipping!</div>
        </div>
        
        <div className={styles.promo}>
          <div className={styles.promoTitle}>free travel accessory gift!</div>
          <div className={styles.promoSub}>online exclusive and limited time only.</div>
          <div className={styles.promoOptions}>
            <div className={styles.promoOption}>compact mirror</div>
            <div className={styles.promoOption}>cosmic t</div>
          </div>
          <div className={styles.promoFooter}>spend another ${giftRemaining.toFixed(0)} and select 1 free gift(s)</div>
        </div>

        <div className={styles.content}>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemRow}>
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
                    <div className={styles.variant}>{item.variant?.value || ''}</div>
                    <button onClick={() => removeItem(item.id)} className={styles.removeLink}>
                      remove
                    </button>
                  </div>
                  <div className={styles.quantity}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.quantityBtn}>
                      –
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.quantityBtn}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summary}>
            <div className={styles.rewards}>
              <span className={styles.rewardsLabel}>kylie rewards</span> <span className={styles.rewardsLink}>log in</span> to earn{' '}
              {Math.max(1, Math.round(total))} points with this purchase
            </div>
            <div className={styles.totalRow}>
              <div>
                <div className={styles.totalLabel}>estimated total:</div>
                <div className={styles.totalSub}>shipping &amp; discounts calculated at checkout</div>
              </div>
              <div className={styles.totalVal}>${total.toFixed(0)}</div>
            </div>
            <button onClick={() => navigate('/checkout')} className={styles.checkoutBtn}>
              checkout
            </button>
            <button onClick={clearCart} className={styles.clearBtn}>
              clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

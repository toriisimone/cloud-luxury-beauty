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
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.empty}>Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className={styles.shopBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shipping = total >= 75 ? 0 : 10;

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>
        
        <div className={styles.content}>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.product?.name}</h3>
                  {item.variant && (
                    <p className={styles.variant}>{item.variant.name}: {item.variant.value}</p>
                  )}
                  <p className={styles.itemPrice}>
                    ${((item.variant?.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityBtn}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className={styles.summaryRowTotal}>
              <span>Total</span>
              <span>${(total + shipping).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className={styles.checkoutBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                {/* Shopping bag icon - same design as navbar, black and white, no borders */}
                <rect x="6" y="9" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M8 9C8 7.5 8.5 6.5 9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M16 9C16 7.5 15.5 6.5 14.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              Proceed to Checkout
            </button>
            <button onClick={clearCart} className={styles.clearBtn}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

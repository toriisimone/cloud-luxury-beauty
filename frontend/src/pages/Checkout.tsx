import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useCoupons } from '../hooks/useCoupons';
import * as ordersApi from '../api/ordersApi';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { getCouponByCode } = useCoupons();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <p className={styles.error}>Please log in to checkout.</p>
          <button onClick={() => navigate('/account')} className={styles.loginBtn}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.checkout}>
        <div className={styles.container}>
          <p className={styles.error}>Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className={styles.shopBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const coupon = await getCouponByCode(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setError(null);
    } else {
      setError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getTotal();
    if (appliedCoupon.type === 'PERCENTAGE') {
      let discount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
      return discount;
    } else if (appliedCoupon.type === 'FIXED') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const order = await ordersApi.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress,
        couponCode: appliedCoupon?.code,
      });

      clearCart();
      navigate(`/account?order=${order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotal();
  const discount = calculateDiscount();
  const shipping = subtotal >= 75 ? 0 : 10;
  const total = subtotal - discount + shipping;

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.sections}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              <div className={styles.formGroup}>
                <label>Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>State</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Zip Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Country</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {appliedCoupon && (
                  <div className={styles.summaryRow}>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.summaryRowTotal}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.couponSection}>
                <label>Coupon Code</label>
                <div className={styles.couponInput}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                  />
                  <button type="button" onClick={handleApplyCoupon} className={styles.applyBtn}>
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className={styles.couponApplied}>
                    Coupon {appliedCoupon.code} applied!
                  </p>
                )}
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

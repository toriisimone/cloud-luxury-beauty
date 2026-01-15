import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as usersApi from '../api/usersApi';
import * as ordersApi from '../api/ordersApi';
import { Order } from '../types/global';
import styles from './Account.module.css';

const Account = () => {
  const { user, login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportEmailHref = useMemo(() => `mailto:support@aurapop.com?subject=Password%20reset`, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        await register(formData.email, formData.password, formData.firstName, formData.lastName);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className={styles.account}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Account</h1>
          
          <div className={styles.sections}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <div className={styles.profileInfo}>
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Order History</h2>
              {orders.length === 0 ? (
                <p className={styles.empty}>No orders yet.</p>
              ) : (
                <div className={styles.orders}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.order}>
                      <div className={styles.orderHeader}>
                        <span className={styles.orderId}>Order #{order.id.slice(0, 8)}</span>
                        <span className={styles.orderStatus}>{order.status}</span>
                        <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                      </div>
                      <p className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.account}>
      <div className={styles.container}>
        <div className={styles.authForm}>
          <h1 className={styles.loginTitle}>{isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}</h1>
          
          {!isLogin && (
            <div className={styles.toggle}>
              <button onClick={() => setIsLogin(true)} className={styles.linkBtn}>
                back to login
              </button>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className={styles.formGroup}>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email"
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.passwordRow}>
                <span className={styles.passwordLabel}>password</span>
                {isLogin && (
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => window.open(supportEmailHref, '_self')}
                  >
                    forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="password"
              />
            </div>

            {isLogin && (
              <div className={styles.terms}>
                by logging in, you agree to our{' '}
                <a className={styles.termsLink} href="/terms">
                  terms
                </a>
                ,{' '}
                <a className={styles.termsLink} href="/privacy">
                  privacy policy
                </a>
                , and{' '}
                <a className={styles.termsLink} href="/rewards">
                  rewards program terms
                </a>
              </div>
            )}

            <button type="submit" disabled={loading} className={styles.loginBtn}>
              {loading ? 'please wait…' : isLogin ? 'log in' : 'create account'}
            </button>

            {isLogin && (
              <div className={styles.createPrompt}>
                <div>don&apos;t have an account yet?</div>
                <button type="button" className={styles.createLink} onClick={() => setIsLogin(false)}>
                  create account
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;

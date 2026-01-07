import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CouponCard from '../components/CouponCard';
import Loader from '../components/Loader';
import { Coupon } from '../types/global';
import * as couponsApi from '../api/couponsApi';
import styles from './Coupons.module.css';

const Coupons = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const fetchCoupons = async () => {
      try {
        const data = await couponsApi.getCoupons();
        setCoupons(data);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.coupons}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Coupons</h1>
        
        {coupons.length === 0 ? (
          <p className={styles.empty}>No coupons found.</p>
        ) : (
          <div className={styles.grid}>
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;

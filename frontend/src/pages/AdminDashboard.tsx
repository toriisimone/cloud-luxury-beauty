import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosClient from '../api/axiosClient';
import Loader from '../components/Loader';
import styles from './AdminDashboard.module.css';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Total Users</h3>
            <p className={styles.statValue}>{stats?.totalUsers || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Total Products</h3>
            <p className={styles.statValue}>{stats?.totalProducts || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Total Orders</h3>
            <p className={styles.statValue}>{stats?.totalOrders || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Total Revenue</h3>
            <p className={styles.statValue}>${(stats?.totalRevenue || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => navigate('/admin/coupons')} className={styles.actionBtn}>
            Manage Coupons
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

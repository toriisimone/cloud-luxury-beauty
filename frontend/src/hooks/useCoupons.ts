import { useState, useEffect } from 'react';
import { Coupon } from '../types/global';
import * as couponsApi from '../api/couponsApi';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const data = await couponsApi.getCoupons();
        setCoupons(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const getCouponByCode = async (code: string): Promise<Coupon | null> => {
    try {
      const coupon = await couponsApi.getCouponByCode(code);
      return coupon;
    } catch (err) {
      return null;
    }
  };

  return { coupons, loading, error, getCouponByCode };
};

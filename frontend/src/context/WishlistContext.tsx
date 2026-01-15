import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as usersApi from '../api/usersApi';
import { useAuth } from './AuthContext';

type WishlistContextValue = {
  wishlistIds: Set<string>;
  loading: boolean;
  refresh: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const items = await usersApi.getWishlist();
      setWishlistIds(new Set(items.map((i) => i.product.id)));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) return;
      const next = new Set(wishlistIds);
      const exists = next.has(productId);
      if (exists) {
        next.delete(productId);
        setWishlistIds(next);
        await usersApi.removeFromWishlist(productId);
      } else {
        next.add(productId);
        setWishlistIds(next);
        await usersApi.addToWishlist(productId);
      }
    },
    [isAuthenticated, wishlistIds]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      loading,
      refresh,
      isInWishlist,
      toggleWishlist,
    }),
    [wishlistIds, loading, refresh, isInWishlist, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextValue => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};


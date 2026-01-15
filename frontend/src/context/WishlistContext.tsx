import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as usersApi from '../api/usersApi';
import { useAuth } from './AuthContext';

type WishlistContextValue = {
  wishlistIds: Set<string>;
  loading: boolean;
  refresh: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  guestPromptOpen: boolean;
  dismissGuestPrompt: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'aurapop:wishlistIds';
const PROMPT_KEY = 'aurapop:wishlistPromptShown';

const loadLocalIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === 'string');
    return [];
  } catch {
    return [];
  }
};

const saveLocalIds = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const localIds = loadLocalIds();
      if (!isAuthenticated) {
        setWishlistIds(new Set(localIds));
        return;
      }

      const items = await usersApi.getWishlist();
      const serverIds = items.map((i) => i.product.id);

      // Merge local + server, and push local-only ids to server for better persistence.
      const merged = Array.from(new Set([...serverIds, ...localIds]));
      setWishlistIds(new Set(merged));
      saveLocalIds(merged);

      const localOnly = localIds.filter((id) => !serverIds.includes(id));
      if (localOnly.length > 0) {
        await Promise.all(localOnly.map((id) => usersApi.addToWishlist(id)));
      }
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
      const next = new Set(wishlistIds);
      const exists = next.has(productId);
      if (exists) next.delete(productId);
      else next.add(productId);

      setWishlistIds(next);
      saveLocalIds(Array.from(next));

      // Guest prompt after 5 favorites (only once, only for guests)
      if (!isAuthenticated && !exists && next.size >= 5) {
        const shown = localStorage.getItem(PROMPT_KEY) === 'true';
        if (!shown) {
          setGuestPromptOpen(true);
          localStorage.setItem(PROMPT_KEY, 'true');
        }
      }

      if (isAuthenticated) {
        if (exists) await usersApi.removeFromWishlist(productId);
        else await usersApi.addToWishlist(productId);
      }
    },
    [isAuthenticated, wishlistIds]
  );

  const dismissGuestPrompt = useCallback(() => setGuestPromptOpen(false), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      loading,
      refresh,
      isInWishlist,
      toggleWishlist,
      guestPromptOpen,
      dismissGuestPrompt,
    }),
    [wishlistIds, loading, refresh, isInWishlist, toggleWishlist, guestPromptOpen, dismissGuestPrompt]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextValue => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};


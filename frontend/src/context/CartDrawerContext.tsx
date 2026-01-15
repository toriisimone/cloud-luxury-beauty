import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CartItem, Product, ProductVariant } from '../types/global';

type LastAdded = {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
};

type CartDrawerContextValue = {
  isOpen: boolean;
  lastAdded: LastAdded | null;
  open: (payload?: LastAdded) => void;
  close: () => void;
};

const CartDrawerContext = createContext<CartDrawerContextValue | undefined>(undefined);

export const CartDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);

  const open = useCallback((payload?: LastAdded) => {
    setLastAdded(payload ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartDrawerContextValue>(
    () => ({ isOpen, lastAdded, open, close }),
    [isOpen, lastAdded, open, close]
  );

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>;
};

export const useCartDrawer = (): CartDrawerContextValue => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error('useCartDrawer must be used within a CartDrawerProvider');
  return ctx;
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types/global';
import axiosClient from '../api/axiosClient';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axiosClient.get('/cart');
          setItems(response.data);
        } catch (error) {
          // Cart not synced yet, use local storage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            setItems(JSON.parse(localCart));
          }
        }
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        }
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id && item.variantId === (variant?.id || undefined)
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        id: `${product.id}-${variant?.id || 'default'}`,
        productId: product.id,
        variantId: variant?.id,
        quantity,
        product,
        variant,
      };

      return [...prevItems, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.variant?.price || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

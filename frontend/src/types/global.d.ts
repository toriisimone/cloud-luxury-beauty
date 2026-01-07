declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  images: string[];
  categoryId: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BOGO';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  categoryId?: string;
  active: boolean;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponId?: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  createdAt: string;
  items?: OrderItem[];
  coupon?: Coupon;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

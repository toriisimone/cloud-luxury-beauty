import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartDrawerProvider } from './context/CartDrawerContext';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import Skincare from './pages/Skincare';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import Coupons from './pages/Coupons';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './App.module.css';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('aurapop:splashSeen') !== 'true';
  });

  useEffect(() => {
    if (!showSplash) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showSplash]);

  // Warm category banner images early so they're already there on click.
  useEffect(() => {
    const categories = ['skincare', 'makeup', 'hair', 'fragrance', 'body'];
    const links: HTMLLinkElement[] = [];

    categories.forEach((key) => {
      const base = key === 'skincare' ? 'skin-banner' : `${key}-banner`;
      const hrefs = [
        `/assets/images/menu/${key}/${base}.png`,
        `/assets/images/menu/${key}/${base}.jpg`,
        `/assets/images/menu/${key}/${base}.jpeg`,
        `/images/category-banners/${key}-banner.png`,
        `/images/category-banners/${key}-banner.jpg`,
        `/images/category-banners/${key}-banner.jpeg`,
      ];

      hrefs.forEach((href, i) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = href;
        link.fetchPriority = i === 0 ? 'high' : 'low';
        document.head.appendChild(link);
        links.push(link);
      });
    });

    return () => {
      links.forEach((l) => l.parentNode?.removeChild(l));
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CartDrawerProvider>
            <Router>
              <ScrollToTop />
              <div className={styles.app}>
                {showSplash && (
                  <InitialLoadingScreen
                    minDurationMs={120}
                    onDone={() => {
                      try {
                        sessionStorage.setItem('aurapop:splashSeen', 'true');
                      } catch {
                        // ignore
                      }
                      setShowSplash(false);
                    }}
                  />
                )}
                <Navbar />
                <CartDrawer />
                <main className={styles.main}>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/skincare" element={<Skincare />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/category/:topCategory" element={<CategoryPage />} />
                      <Route path="/category/:topCategory/:subCategory" element={<CategoryPage />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/coupons" element={<Coupons />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
            </Router>
          </CartDrawerProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

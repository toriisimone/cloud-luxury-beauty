import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartDrawerProvider } from './context/CartDrawerContext';
import InitialLoadingScreen from './components/InitialLoadingScreen';
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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showSplash]);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CartDrawerProvider>
            <Router>
              <div className={styles.app}>
                {showSplash && <InitialLoadingScreen onDone={() => setShowSplash(false)} />}
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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ProductCarousel from '../components/ProductCarousel';
import BrandBanner from '../components/BrandBanner';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Home = () => {
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  // AMAZON API DISABLED: Always use database products
  // const [amazonSkincareProducts, setAmazonSkincareProducts] = useState<AmazonProduct[]>([]);
  // const [useAmazonProducts, setUseAmazonProducts] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching products and categories for homepage...');
        setLoading(true);
        
        // Fetch categories first
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
        console.log('[HOME] Categories fetched:', categoriesRes.length);

        // AMAZON API DISABLED: Always fetch from database for Skincare
        const skincareCategory = categoriesRes.find(cat => 
          cat.name === 'Skincare' || 
          cat.name === 'skincare' || 
          cat.name.toLowerCase() === 'skincare'
        );

        if (skincareCategory) {
          console.log('[HOME] Fetching skincare products from database (category:', skincareCategory.id, ')');
          const skincareProductsRes = await productsApi.getProducts({ 
            category: 'Skincare', // Use category name
            limit: 12 
          });
          setSkincareProducts(skincareProductsRes.products);
          console.log('[HOME] ✅ Skincare products fetched:', skincareProductsRes.products.length);
        } else {
          console.warn('[HOME] Skincare category not found. Displaying all products instead.');
          const allProductsRes = await productsApi.getProducts({ limit: 12 });
          setSkincareProducts(allProductsRes.products);
          console.log('[HOME] ✅ All products fetched:', allProductsRes.products.length);
        }
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch data:', error);
        console.error('[HOME] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullURL: `${error.config?.baseURL}${error.config?.url}`,
        });
        // Set empty arrays but don't block the page
        setSkincareProducts([]);
        setCategories([]);
      } finally {
        // ALWAYS set loading to false
        setLoading(false);
        console.log('[HOME] ✅ Loading complete');
      }
    };

    fetchData();
  }, []);

  // Log rendering state for debugging
  console.log('[HOME RENDER] ========== RENDERING HOME PAGE ==========');
  console.log('[HOME RENDER] Loading:', loading);
  console.log('[HOME RENDER] Skincare products:', skincareProducts.length);
  console.log('[HOME RENDER] Categories:', categories.length);

  // Show loader ONLY when loading is true
  if (loading) {
    console.log('[HOME RENDER] Showing loader...');
    return <Loader />;
  }

  const hasSkincareProducts = skincareProducts.length > 0;

  console.log('[HOME RENDER] Has skincare products:', hasSkincareProducts);

  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url(/images/hero-banner.jpg)` }}
        >
          {/* Cloud Overlay */}
          <div className={styles.cloudOverlay}></div>
          
          {/* Brand Name Overlay */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>
        </div>
      </section>

      {/* Brand Banner - Moving brands between hero and featured */}
      <BrandBanner />

      {/* Product Carousel Section - Kylie Style */}
      <ProductCarousel
        products={[
          { id: '51', title: 'Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71FIL4QFAHL._AC_UL600_SR600,400_.jpg', price: 24.99, rating: 4.5, reviewCount: 1000, affiliate: 'https://www.amazon.com/dp/B0FXTGD7LC/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '52', title: 'Dr.Althea PDRN Reju 5000 Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/419qAvG77UL._AC_UL600_SR600,400_.jpg', price: 32.99, rating: 4.3, reviewCount: 850, affiliate: 'https://www.amazon.com/dp/B0G26XC6KT/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '55', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71j6xfG0fkL._AC_UL600_SR600,400_.jpg', price: 12.99, rating: 4.7, reviewCount: 320, affiliate: 'https://www.amazon.com/dp/B0FYVG98GM/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '58', title: 'e.l.f. SKIN Bright + Brew-tiful Eye Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61ax411X7gL._AC_UL600_SR600,400_.jpg', price: 10.99, rating: 4.4, reviewCount: 1200, affiliate: 'https://www.amazon.com/dp/B0G1H91LGM/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '59', title: 'Lattafa Asad Elixir EDP', image: 'https://images-na.ssl-images-amazon.com/images/I/51f4XfVZtGL._AC_UL600_SR600,400_.jpg', price: 22.99, rating: 4.6, reviewCount: 650, affiliate: 'https://www.amazon.com/dp/B0FWYPY4FX/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '61', title: 'Saltair Hyaluronic Acid Body Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51mZFbRKa+L._AC_UL600_SR600,400_.jpg', price: 14.99, rating: 4.5, reviewCount: 890, affiliate: 'https://www.amazon.com/dp/B0FX39VLRL/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '64', title: 'GODA for Her Perfume and Silk Body Oil', image: 'https://images-na.ssl-images-amazon.com/images/I/61hUIcbOjrL._AC_UL600_SR600,400_.jpg', price: 28.99, rating: 4.8, reviewCount: 450, affiliate: 'https://www.amazon.com/dp/B0G3RN2SC7/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '67', title: 'Lash Serum for Eyelashes & Eyebrows', image: 'https://images-na.ssl-images-amazon.com/images/I/61UQjAx4z5L._AC_UL600_SR600,400_.jpg', price: 19.99, rating: 4.6, reviewCount: 1100, affiliate: 'https://www.amazon.com/dp/B0GD12FCYQ/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '70', title: "L'Oreal Revitalift Triple Power Eye Bag Eraser", image: 'https://images-na.ssl-images-amazon.com/images/I/81RcZcfyRQL._AC_UL600_SR600,400_.jpg', price: 18.99, rating: 4.4, reviewCount: 750, affiliate: 'https://www.amazon.com/dp/B0FXJ4KJZQ/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '73', title: 'Prequel Skin Retinaldehyde 0.1%', image: 'https://images-na.ssl-images-amazon.com/images/I/614XaVcFu8L._AC_UL600_SR600,400_.jpg', price: 26.99, rating: 4.7, reviewCount: 520, affiliate: 'https://www.amazon.com/dp/B0FY36QKW8/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '75', title: 'COSRX Advanced Pure Vitamin C 23% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71LzZAsVE+L._AC_UL600_SR600,400_.jpg', price: 24.99, rating: 4.5, reviewCount: 980, affiliate: 'https://www.amazon.com/dp/B0FWQGLTQV/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '78', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/61PoCKMjBSL._AC_UL600_SR600,400_.jpg', price: 12.99, rating: 4.6, reviewCount: 410, affiliate: 'https://www.amazon.com/dp/B0FXTTV4NV/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '79', title: 'e.l.f. Soft Glam Brightening Corrector', image: 'https://images-na.ssl-images-amazon.com/images/I/61je2LPc2qL._AC_UL600_SR600,400_.jpg', price: 7.99, rating: 4.3, reviewCount: 1350, affiliate: 'https://www.amazon.com/dp/B0G1H283LW/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '90', title: 'The Ordinary Volufiline 92% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/61D3pKRpxaL._AC_UL300_SR300,200_.jpg', price: 28.99, rating: 4.8, reviewCount: 720, affiliate: 'https://www.amazon.com/dp/B0FYJ4WQ5J/?tag=victoria0cdb-20', badge: 'best seller' },
          { id: '91', title: 'CeraVe Invisible Mineral Sunscreen SPF 50', image: 'https://images-na.ssl-images-amazon.com/images/I/61IvJtPa9EL._AC_UL300_SR300,200_.jpg', price: 14.99, rating: 4.5, reviewCount: 1600, affiliate: 'https://www.amazon.com/dp/B0FXNHDWM7/?tag=victoria0cdb-20', badge: 'best seller' },
        ]}
        title="featured skincare"
      />

      {/* Shop Skincare Section - Only render if we have products */}
      {hasSkincareProducts && (
        <section className={styles.skincareSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shop Skincare</h2>
            <div className={styles.productsGrid}>
              {skincareProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className={styles.viewMoreContainer}>
              <Link to="/products/skincare" className={styles.viewMoreButton}>
                View All Skincare
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Cloud Divider - Only show if we have categories */}
      {categories.length > 0 && <div className={styles.cloudDivider}></div>}

      {/* Shop by Category Section */}
      {categories.length > 0 && (
        <section className={styles.categorySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cloud Divider - Only show at bottom if we have content */}
      {(hasSkincareProducts || categories.length > 0) && <div className={styles.cloudDivider}></div>}
    </div>
  );
};

export default Home;

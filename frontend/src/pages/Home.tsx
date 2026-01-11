import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Category, Product } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import * as productsApi from '../api/productsApi';
import styles from './Home.module.css';

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching categories and featured products for homepage...');
        setLoading(true);
        
        // Fetch categories and featured products in parallel
        const [categoriesRes, productsRes] = await Promise.all([
          categoriesApi.getCategories(),
          productsApi.getProducts({ featured: true, limit: 8, page: 1 })
        ]);
        
        setCategories(categoriesRes);
        setFeaturedProducts(productsRes.products || []);
        console.log('[HOME] Categories fetched:', categoriesRes.length);
        console.log('[HOME] Featured products fetched:', productsRes.products?.length || 0);
        
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
        setCategories([]);
        setFeaturedProducts([]);
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
  console.log('[HOME RENDER] Categories:', categories.length);
  console.log('[HOME RENDER] Featured Products:', featuredProducts.length);

  // Show loader ONLY when loading is true
  if (loading) {
    console.log('[HOME RENDER] Showing loader...');
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url(/images/edition-banner.png)` }}
        >
          {/* CRT TV Overlay */}
          <div className={styles.crtOverlay}></div>
          
          {/* Finger Smoothing Overlay */}
          <div className={styles.fingerSmoothOverlay}></div>
          
          {/* Cloud Overlay */}
          <div className={styles.cloudOverlay}></div>
          
          {/* Grain Overlay - Subtle film grain texture */}
          <div className={styles.grainOverlay}></div>
          
          {/* Brand Name Overlay */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>
        </div>
      </section>

      {/* Cloud Divider - After hero banner */}
      <div className={styles.cloudDivider}></div>

      {/* Featured Items Section - Kylie Cosmetics Style - ALWAYS RENDER */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>featured items</h2>
          {featuredProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>Loading featured products...</p>
            </div>
          )}
        </div>
      </section>

      {/* Cloud Divider - Between sections */}
      <div className={styles.cloudDivider}></div>

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
      {categories.length > 0 && <div className={styles.cloudDivider}></div>}
    </div>
  );
};

export default Home;

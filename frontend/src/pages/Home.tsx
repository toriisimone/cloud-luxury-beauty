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
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  const [skincareLoading, setSkincareLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching categories for homepage...');
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
        console.log('[HOME] Categories fetched:', categoriesRes.length);
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
        console.log('[HOME] ✅ Categories loading complete');
      }
    };

    fetchData();
  }, []);

  // Separate effect for skincare products - fetch immediately and retry if needed
  useEffect(() => {
    const fetchSkincareProducts = async () => {
      try {
        console.log('[HOME] ========== FETCHING SKINCARE PRODUCTS ==========');
        setSkincareLoading(true);
        
        // First, try to get the Skincare category ID
        let categoryId: string | undefined;
        try {
          const categoriesRes = await categoriesApi.getCategories();
          const skincareCategory = categoriesRes.find(
            c => c.name.toLowerCase() === 'skincare' || c.slug.toLowerCase() === 'skincare'
          );
          if (skincareCategory) {
            categoryId = skincareCategory.id;
            console.log('[HOME] Found Skincare category ID:', categoryId);
          }
        } catch (err) {
          console.warn('[HOME] Could not fetch categories for ID lookup');
        }
        
        // Fetch skincare products - try both category name and ID
        const response = await productsApi.getProducts({ 
          category: 'Skincare',
          categoryId: categoryId,
          limit: 8, 
          page: 1 
        });
        
        console.log('[HOME] API Response:', {
          productsCount: response.products?.length || 0,
          total: response.total || 0,
          hasProducts: !!(response.products && response.products.length > 0)
        });
        
        if (response.products && response.products.length > 0) {
          setSkincareProducts(response.products);
          console.log('[HOME] ✅ Skincare products set:', response.products.length);
        } else {
          console.warn('[HOME] ⚠️ No products in response, trying without category filter...');
          // Fallback: try fetching all products and filter client-side
          const allProducts = await productsApi.getProducts({ limit: 50, page: 1 });
          if (allProducts.products) {
            const skincare = allProducts.products.filter(p => 
              p.categoryId === categoryId || 
              p.name.toLowerCase().includes('skincare') ||
              p.name.toLowerCase().includes('serum') ||
              p.name.toLowerCase().includes('cream')
            ).slice(0, 8);
            setSkincareProducts(skincare);
            console.log('[HOME] ✅ Found', skincare.length, 'skincare products via fallback');
          } else {
            setSkincareProducts([]);
          }
        }
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch skincare products:', error);
        console.error('[HOME] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });
        setSkincareProducts([]);
      } finally {
        setSkincareLoading(false);
        console.log('[HOME] ✅ Skincare products loading complete');
      }
    };

    fetchSkincareProducts();
  }, []);

  // Log rendering state for debugging
  console.log('[HOME RENDER] ========== RENDERING HOME PAGE ==========');
  console.log('[HOME RENDER] Loading:', loading);
  console.log('[HOME RENDER] Categories:', categories.length);
  console.log('[HOME RENDER] Skincare Products:', skincareProducts.length);
  console.log('[HOME RENDER] Skincare Loading:', skincareLoading);

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

      {/* Featured Skincare Section - DIRECTLY UNDER BANNER - NO GAPS */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>featured skincare</h2>
          {skincareLoading ? (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>Loading skincare products...</p>
            </div>
          ) : skincareProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {skincareProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>No skincare products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cloud Divider - Between sections (after Featured Skincare) */}
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

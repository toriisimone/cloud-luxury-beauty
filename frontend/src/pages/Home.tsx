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

  // Separate effect for skincare products - fetch immediately with multiple fallback strategies
  useEffect(() => {
    const fetchSkincareProducts = async () => {
      try {
        console.log('[HOME] ========== FETCHING SKINCARE PRODUCTS ==========');
        setSkincareLoading(true);
        
        // Strategy 1: Try to get the Skincare category ID first
        let categoryId: string | undefined;
        try {
          const categoriesRes = await categoriesApi.getCategories();
          console.log('[HOME] Categories fetched:', categoriesRes.length);
          const skincareCategory = categoriesRes.find(
            c => c.name.toLowerCase() === 'skincare' || 
                 c.slug.toLowerCase() === 'skincare' ||
                 c.name.toLowerCase().includes('skin')
          );
          if (skincareCategory) {
            categoryId = skincareCategory.id;
            console.log('[HOME] Found Skincare category ID:', categoryId, 'Name:', skincareCategory.name);
          } else {
            console.warn('[HOME] No Skincare category found in categories list');
          }
        } catch (err) {
          console.warn('[HOME] Could not fetch categories for ID lookup:', err);
        }
        
        // Strategy 2: Try fetching with category ID if we found it
        let products: Product[] = [];
        if (categoryId) {
          try {
            const response = await productsApi.getProducts({ 
              categoryId: categoryId,
              limit: 8, 
              page: 1 
            });
            console.log('[HOME] API Response (with categoryId):', {
              productsCount: response.products?.length || 0,
              total: response.total || 0
            });
            if (response.products && response.products.length > 0) {
              products = response.products;
              console.log('[HOME] ✅ Got', products.length, 'products with categoryId');
            }
          } catch (err) {
            console.warn('[HOME] Failed to fetch with categoryId, trying other methods:', err);
          }
        }
        
        // Strategy 3: If no products yet, try with category name
        if (products.length === 0) {
          try {
            const response = await productsApi.getProducts({ 
              category: 'Skincare',
              limit: 8, 
              page: 1 
            });
            console.log('[HOME] API Response (with category name):', {
              productsCount: response.products?.length || 0,
              total: response.total || 0
            });
            if (response.products && response.products.length > 0) {
              products = response.products;
              console.log('[HOME] ✅ Got', products.length, 'products with category name');
            }
          } catch (err) {
            console.warn('[HOME] Failed to fetch with category name:', err);
          }
        }
        
        // Strategy 4: Fallback - fetch all products and filter client-side
        if (products.length === 0) {
          try {
            console.log('[HOME] Trying fallback: fetch all products and filter...');
            const allProductsResponse = await productsApi.getProducts({ limit: 100, page: 1 });
            if (allProductsResponse.products && allProductsResponse.products.length > 0) {
              // Filter for skincare-related products
              const skincare = allProductsResponse.products.filter(p => {
                const nameLower = p.name.toLowerCase();
                const descLower = (p.description || '').toLowerCase();
                return (
                  (categoryId && p.categoryId === categoryId) ||
                  nameLower.includes('skincare') ||
                  nameLower.includes('serum') ||
                  nameLower.includes('cream') ||
                  nameLower.includes('moisturizer') ||
                  nameLower.includes('cleanser') ||
                  nameLower.includes('toner') ||
                  nameLower.includes('mask') ||
                  descLower.includes('skincare')
                );
              }).slice(0, 8);
              products = skincare;
              console.log('[HOME] ✅ Found', products.length, 'skincare products via fallback filtering');
            }
          } catch (err) {
            console.error('[HOME] Fallback fetch also failed:', err);
          }
        }
        
        // Strategy 5: Last resort - just get any 8 products if we still have nothing
        if (products.length === 0) {
          try {
            console.log('[HOME] Last resort: fetching any products...');
            const anyProductsResponse = await productsApi.getProducts({ limit: 8, page: 1 });
            if (anyProductsResponse.products && anyProductsResponse.products.length > 0) {
              products = anyProductsResponse.products;
              console.log('[HOME] ✅ Using', products.length, 'general products as fallback');
            }
          } catch (err) {
            console.error('[HOME] Last resort fetch failed:', err);
          }
        }
        
        setSkincareProducts(products);
        console.log('[HOME] ✅ Final skincare products count:', products.length);
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch skincare products:', error);
        console.error('[HOME] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
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

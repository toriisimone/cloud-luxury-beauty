import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
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

      {/* Cloud Divider - Only show if we have skincare products */}
      {hasSkincareProducts && <div className={styles.cloudDivider}></div>}

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
              <Link to="/products?category=Skincare" className={styles.viewMoreButton}>
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

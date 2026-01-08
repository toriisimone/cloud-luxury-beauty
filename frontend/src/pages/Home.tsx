import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AmazonProductCard from '../components/AmazonProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import { AmazonProduct } from '../api/amazonApi';
import * as productsApi from '../api/productsApi';
import * as amazonApi from '../api/amazonApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

const Home = () => {
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  const [amazonSkincareProducts, setAmazonSkincareProducts] = useState<AmazonProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [useAmazonProducts, setUseAmazonProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching products and categories for homepage...');
        setLoading(true);
        
        // Fetch categories first
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
        console.log('[HOME] Categories fetched:', categoriesRes.length);

        // Try to fetch Amazon skincare products first
        try {
          console.log('[HOME] Attempting to fetch Amazon skincare products...');
          const amazonResponse = await amazonApi.getAmazonSkincareProducts();
          if (amazonResponse.products && amazonResponse.products.length > 0) {
            setAmazonSkincareProducts(amazonResponse.products.slice(0, 12));
            setUseAmazonProducts(true);
            console.log('[HOME] ✅ Amazon skincare products fetched:', amazonResponse.products.length);
          } else {
            throw new Error('No Amazon products returned');
          }
        } catch (amazonError: any) {
          console.warn('[HOME] ⚠️ Failed to fetch Amazon products, falling back to regular products:', amazonError);
          // Fallback to regular products
          const skincareCategory = categoriesRes.find(cat => 
            cat.name === 'Skincare' || 
            cat.name === 'skincare' || 
            cat.name.toLowerCase() === 'skincare'
          );
          let skincareProductsRes: productsApi.ProductsResponse;

          if (skincareCategory) {
            console.log('[HOME] Fetching regular skincare products from category:', skincareCategory.id);
            skincareProductsRes = await productsApi.getProducts({ categoryId: skincareCategory.id, limit: 12 });
            setSkincareProducts(skincareProductsRes.products);
          } else {
            console.warn('[HOME] Skincare category not found. Displaying all products instead.');
            skincareProductsRes = await productsApi.getProducts({ limit: 12 });
            setSkincareProducts(skincareProductsRes.products);
          }
          setUseAmazonProducts(false);
          console.log('[HOME] ✅ Regular skincare products fetched:', skincareProductsRes.products.length);
        }
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch data:', error);
        console.error('[HOME] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        // Set empty arrays but don't block the page
        setSkincareProducts([]);
        setAmazonSkincareProducts([]);
        setCategories([]);
      } finally {
        // ALWAYS set loading to false
        setLoading(false);
        console.log('[HOME] ✅ Loading complete');
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

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

      {/* Cloud Divider */}
      <div className={styles.cloudDivider}></div>

      {/* Shop Skincare Section */}
      {(useAmazonProducts ? amazonSkincareProducts.length > 0 : skincareProducts.length > 0) && (
        <section className={styles.skincareSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shop Skincare</h2>
            <div className={styles.productsGrid}>
              {useAmazonProducts
                ? amazonSkincareProducts.map((product) => (
                    <AmazonProductCard key={product.asin} product={product} />
                  ))
                : skincareProducts.map((product) => (
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

      {/* Cloud Divider */}
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

      {/* Cloud Divider */}
      <div className={styles.cloudDivider}></div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

const Home = () => {
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products and categories for homepage...');
        
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);

        // Find Skincare category ID
        const skincareCategory = categoriesRes.find(cat => cat.name === 'Skincare');
        let skincareProductsRes: productsApi.ProductsResponse;

        if (skincareCategory) {
          skincareProductsRes = await productsApi.getProducts({ categoryId: skincareCategory.id, limit: 12 });
          setSkincareProducts(skincareProductsRes.products);
        } else {
          console.warn('Skincare category not found. Displaying all products instead.');
          skincareProductsRes = await productsApi.getProducts({ limit: 12 });
          setSkincareProducts(skincareProductsRes.products);
        }
        
        console.log('Skincare products fetched:', skincareProductsRes.products.length);
        console.log('Categories fetched:', categoriesRes.length);
        
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        setSkincareProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
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
      {skincareProducts.length > 0 && (
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

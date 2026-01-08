import { useEffect, useState } from 'react';
import HeroCloud from '../components/HeroCloud';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products and categories...');
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getProducts({ featured: true, limit: 8 }),
          categoriesApi.getCategories(),
        ]);
        console.log('Products fetched:', productsRes.products.length);
        console.log('Categories fetched:', categoriesRes.length);
        setFeaturedProducts(productsRes.products);
        setCategories(categoriesRes);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          url: error?.config?.url,
        });
        // Set empty arrays on error so UI doesn't break
        setFeaturedProducts([]);
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
      <div className={styles.heroWrap}>
        <HeroCloud />
        <div className={styles.heroFade} aria-hidden="true" />
      </div>

      <section className={styles.promiseSection}>
        <div className={styles.container}>
          <div className={styles.promiseHeader}>
            <p className={styles.kicker}>Elevated elegance in the clouds</p>
            <h2 className={styles.promiseTitle}>The Cloud Standard</h2>
            <p className={styles.promiseSubtitle}>
              A luxury cloud boutique—soft, luminous, and intentionally curated.
            </p>
          </div>

          <div className={styles.promiseGrid}>
            <div className={styles.promiseCard}>
              <h3 className={styles.promiseCardTitle}>Airbrushed Finish</h3>
              <p className={styles.promiseCardText}>
                Weightless textures with a velvet glow—never heavy, always refined.
              </p>
            </div>
            <div className={styles.promiseCard}>
              <h3 className={styles.promiseCardTitle}>Dreamy Hydration</h3>
              <p className={styles.promiseCardText}>
                Cushion-soft moisture and silky oils for a cloud-kissed complexion.
              </p>
            </div>
            <div className={styles.promiseCard}>
              <h3 className={styles.promiseCardTitle}>Curated Drops</h3>
              <p className={styles.promiseCardText}>
                Limited, boutique-style edits—made to feel exclusive and effortless.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          {categories.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Categories loading...</p>
            </div>
          ) : (
            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <p className={styles.featuredSubcopy}>
              Your cloud-curated edit—soft glam, luminous skin, and elevated essentials.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>New drops are landing soon.</p>
              <p className={styles.emptyText}>
                We’re preparing your cloud edit. Check back in a moment.
              </p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

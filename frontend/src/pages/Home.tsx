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
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getProducts({ featured: true, limit: 8 }),
          categoriesApi.getCategories(),
        ]);
        setFeaturedProducts(productsRes.products);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
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
      <HeroCloud />
      
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

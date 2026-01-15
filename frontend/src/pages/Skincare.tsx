import { useEffect, useState } from 'react';
import CategoryHeaderStack from '../components/CategoryHeaderStack';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './Skincare.module.css';

const Skincare = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productsApi.getProducts({ category: 'skincare', page: 1, limit: 48 });
        setProducts(res.products || []);
      } catch (e) {
        console.error('[Skincare] Failed to load products:', e);
        setProducts([]);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className={styles.skincarePage}>
      {/* Back to Top Button */}
      <button className={styles.backToTop} type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to Top
      </button>

      <div className={styles.container}>
        <CategoryHeaderStack
          bannerKey="skincare"
          bannerTitle="SKINCARE"
          breadcrumbLabel="skincare"
          productCount={products.length}
          baseCategorySlug="skincare"
        />

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skincare;

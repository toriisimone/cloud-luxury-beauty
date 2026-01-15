import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryHeaderStack from '../components/CategoryHeaderStack';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { topCategory, subCategory } = useParams<{ topCategory?: string; subCategory?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const normalizedCategory = useMemo(() => {
    if (!topCategory) return null;
    return topCategory.toLowerCase();
  }, [topCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!normalizedCategory) {
          setProducts([]);
          setTotal(0);
          return;
        }

        // Use the SAME backend category endpoint style as the homepage carousel:
        // GET /api/products?category=skincare|makeup|hair|fragrance|body
        const response = await productsApi.getProducts({
          category: normalizedCategory,
          // If you use subCategory routes, we can optionally narrow results.
          // This won't break core category pages if subCategory isn't meaningful in DB.
          search: subCategory ? subCategory.replace(/-/g, ' ') : undefined,
          page: 1,
          limit: 48,
        });

        setProducts(response.products || []);
        setTotal(response.total || response.products?.length || 0);
      } catch (error) {
        console.error('[CategoryPage] Error loading products:', error);
        setProducts([]);
        setTotal(0);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [normalizedCategory, subCategory]);

  const getPageTitle = (): string => {
    if (subCategory) {
      return subCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (topCategory) {
      return topCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Products';
  };

  if (loading) {
    return (
      <div className={styles.categoryPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <button
        className={styles.backToTop}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to Top
      </button>
      <div className={styles.container}>
        {/* Kylie-style category header stack (banner + breadcrumb + 6 tiles + count + boxed sort/filter) */}
        {normalizedCategory && (
          <CategoryHeaderStack
            bannerKey={normalizedCategory}
            bannerTitle={getPageTitle().toUpperCase()}
            breadcrumbLabel={getPageTitle().toLowerCase()}
            productCount={total || products.length}
            baseCategorySlug={normalizedCategory}
          />
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Product Grid (DB-backed) */}
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : !error ? (
          <div className={styles.emptyState}>
            <p>No products found in this category.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryPage;

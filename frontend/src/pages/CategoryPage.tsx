import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { Product, getProductsByCategory, loadAllProducts, getAllProducts } from '../data/productData';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { topCategory, subCategory } = useParams<{ topCategory?: string; subCategory?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Load all products from CSV
        await loadAllProducts();
        const allProducts = getAllProducts();
        
        // Filter by category
        const filtered = getProductsByCategory(
          allProducts,
          topCategory,
          subCategory
        );
        
        setProducts(filtered);
      } catch (error) {
        console.error('[CategoryPage] Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [topCategory, subCategory]);

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
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <p className={styles.productCount}>{products.length} Results</p>
        </div>

        {/* Sort Bar */}
        <div className={styles.sortBar}>
          <div className={styles.sortContainer}>
            <button className={styles.sortButton}>
              Sort by: <b>Relevance</b>
              <svg width="7" height="4" viewBox="0 0 7 4" className={styles.sortChevron}>
                <path d="m.5.5 3 3 3-3" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} showAds={true} adInterval={4} />
        ) : (
          <div className={styles.emptyState}>
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './Products.module.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryId = searchParams.get('categoryId');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const page = parseInt(searchParams.get('page') || '1', 10);

        const params: productsApi.GetProductsParams = {
          categoryId: categoryId || undefined,
          search: search || undefined,
          featured: featured === 'true' ? true : undefined,
          page,
          limit: 20,
        };

        const response = await productsApi.getProducts(params);
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setCurrentPage(response.page);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <h1 className={styles.title}>All Products</h1>
        
        {products.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', page.toString());
                      window.location.search = newParams.toString();
                    }}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;

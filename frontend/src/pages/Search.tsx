import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './Search.module.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const [input, setInput] = useState(q);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const queryLabel = useMemo(() => (q ? `Results for “${q}”` : 'Search'), [q]);

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    const run = async () => {
      if (!q) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await productsApi.getProducts({ search: q, page: 1, limit: 48 });
        setProducts(res.products || []);
      } catch (e) {
        console.error('[Search] Failed to search products:', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [q]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{queryLabel}</h1>
          <form
            className={styles.searchForm}
            onSubmit={(e) => {
              e.preventDefault();
              const next = (input || '').trim();
              const nextParams = new URLSearchParams(searchParams);
              if (!next) {
                nextParams.delete('q');
              } else {
                nextParams.set('q', next);
              }
              setSearchParams(nextParams);
            }}
          >
            <input
              className={styles.searchInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
            <button className={styles.searchButton} type="submit">
              Search
            </button>
          </form>
          {q && <div className={styles.count}>{products.length} results</div>}
        </div>

        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : q ? (
          <div className={styles.empty}>No products found.</div>
        ) : (
          <div className={styles.empty}>Type a search above.</div>
        )}
      </div>
    </div>
  );
};

export default Search;


import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import * as productsApi from '../api/productsApi';
import { Product } from '../types/global';
import { getCategoryStructure } from '../data/productData';
import styles from './SearchOverlay.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchOverlay = ({ isOpen, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const categories = useMemo(() => getCategoryStructure().map((c) => c.topCategory), []);

  const matchingCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return categories.filter((c) => c.toLowerCase().includes(q)).slice(0, 5);
  }, [categories, query]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productsApi.getProducts({ search: q, page: 1, limit: 12 });
        setResults(res.products || []);
      } catch (e) {
        console.error('[SearchOverlay] search failed:', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 120);

    return () => window.clearTimeout(handle);
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      ref={overlayRef}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>SEARCH</div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close search">
            ×
          </button>
        </div>

        <div className={styles.searchRow}>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
            aria-label="Search products"
          />
        </div>

        {(matchingCategories.length > 0 || query.trim()) && (
          <div className={styles.suggestions}>
            {matchingCategories.length > 0 && (
              <div className={styles.suggestionBlock}>
                <div className={styles.suggestionTitle}>Categories</div>
                <div className={styles.categoryRow}>
                  {matchingCategories.map((c) => (
                    <Link
                      key={c}
                      to={`/category/${c.toLowerCase()}`}
                      className={styles.categoryChip}
                      onClick={onClose}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.resultsHeader}>
          <div className={styles.resultsTitle}>Products</div>
          {query.trim() && <div className={styles.resultsMeta}>{loading ? 'Searching…' : `${results.length} results`}</div>}
        </div>

        <div className={styles.resultsGrid} aria-busy={loading ? 'true' : 'false'}>
          {results.map((p) => (
            <ProductCard key={p.id} product={p} variant="search" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;


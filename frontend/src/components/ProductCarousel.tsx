import { useState, useEffect, useRef } from 'react';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import ProductCard from './ProductCard';
import styles from './ProductCarousel.module.css';

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch from OUR backend DB by core categories (no external API).
        // These map to: GET /api/products?category=skincare|makeup|hair|fragrance|body
        const categories = ['skincare', 'makeup', 'hair', 'fragrance', 'body'] as const;

        const responses = await Promise.all(
          categories.map((c) =>
            productsApi.getProducts({
              category: c,
              page: 1,
              limit: 12,
            })
          )
        );

        // Interleave results so we "pick and choose" from all category pages.
        const buckets = responses.map((r) => r.products);
        const interleaved: Product[] = [];
        let idx = 0;
        while (interleaved.length < 10) {
          let added = false;
          for (const bucket of buckets) {
            if (bucket[idx]) {
              interleaved.push(bucket[idx]);
              added = true;
              if (interleaved.length >= 10) break;
            }
          }
          if (!added) break; // no more products anywhere
          idx++;
        }

        // Deduplicate by id in case the backend returns overlaps
        const unique = Array.from(new Map(interleaved.map((p) => [p.id, p])).values());
        setProducts(unique);
      } catch (error) {
        console.error('Failed to fetch products for carousel:', error);
        setProducts([]);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const checkScrollability = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const showSkeleton = loading || products.length === 0;
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  return (
    <section className={styles.productCarouselSection}>
      <div className={styles.carouselContainer}>
        <ul 
          ref={scrollContainerRef}
          className={styles.productList}
          aria-busy={loading ? 'true' : 'false'}
        >
          {/* Hidden spacer for smooth scrolling */}
          <li aria-hidden="true" className={styles.spacerLeft}></li>
          
          {showSkeleton
            ? skeletonItems.map((i) => (
                <li key={`skeleton-${i}`} className={styles.productItem}>
                  <div className={styles.skeletonCard} aria-hidden="true">
                    <div className={styles.skeletonImage}>{error ? 'Products unavailable' : 'Loading...'}</div>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLineShort} />
                  </div>
                </li>
              ))
            : products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <ProductCard product={product} />
                </li>
              ))}
          
          {/* Hidden spacer for smooth scrolling */}
          <li aria-hidden="true" className={styles.spacerRight}></li>
        </ul>

        {/* Navigation Buttons */}
        {!showSkeleton && (
                  <button
          className={`${styles.carouselButton} ${styles.carouselButtonPrev} ${!canScrollLeft ? styles.carouselButtonDisabled : ''}`}
          aria-label="Previous slide"
          type="button"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <svg viewBox="0 0 24 40" className={styles.carouselArrow}>
            <g fillRule="nonzero" fill="none">
              <path 
                d="M4.547 4.354c-.644.503-.731 1.399-.195 2.003L16.502 20 4.352 33.643c-.537.604-.45 1.497.195 2.002.644.503 1.602.422 2.14-.182L19.646 20.91c.237-.263.354-.587.354-.91 0-.323-.117-.648-.354-.913L6.687 4.536c-.3-.33-.724-.516-1.168-.512a1.58 1.58 0 0 0-.972.33Z" 
                fill="currentColor"
              />
            </g>
          </svg>
                  </button>
        )}

        {!showSkeleton && (
          <button
          className={`${styles.carouselButton} ${styles.carouselButtonNext} ${!canScrollRight ? styles.carouselButtonDisabled : ''}`}
          aria-label="Next slide"
          type="button"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <svg viewBox="0 0 24 40" className={styles.carouselArrow}>
            <g fillRule="nonzero" fill="none">
              <path 
                d="M4.547 4.354c-.644.503-.731 1.399-.195 2.003L16.502 20 4.352 33.643c-.537.604-.45 1.497.195 2.002.644.503 1.602.422 2.14-.182L19.646 20.91c.237-.263.354-.587.354-.91 0-.323-.117-.648-.354-.913L6.687 4.536c-.3-.33-.724-.516-1.168-.512a1.58 1.58 0 0 0-.972.33Z" 
                fill="currentColor"
              />
            </g>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;

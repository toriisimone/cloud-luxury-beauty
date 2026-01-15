import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './ProductCarousel.module.css';

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from all categories, limit to 10
        const response = await productsApi.getProducts({
          page: 1,
          limit: 10
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Failed to fetch products for carousel:', error);
        setProducts([]);
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

  // Generate random rating for demo
  const getRating = (productId: string) => {
    // Consistent rating per product
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 4.0 + (seed % 10) / 10;
    return rating.toFixed(1);
  };

  const getReviewCount = (productId: string) => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = 50 + (seed % 500);
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.productCarouselSection}>
      <div className={styles.carouselContainer}>
        <ul 
          ref={scrollContainerRef}
          className={styles.productList}
        >
          {/* Hidden spacer for smooth scrolling */}
          <li aria-hidden="true" className={styles.spacerLeft}></li>
          
          {products.map((product) => {
            const rating = getRating(product.id);
            const reviewCount = getReviewCount(product.id);
            const ratingPercent = (parseFloat(rating) / 5) * 100;
            const isNew = product.featured || Math.random() > 0.6;

            return (
              <li key={product.id} className={styles.productItem}>
                <Link
                  to={`/products/${product.id}`}
                  className={styles.productLink}
                  aria-label={`${product.name}`}
                >
                  <div className={styles.productImageContainer}>
                    <div className={styles.productImageWrapper}>
                      {product.images && product.images.length > 0 ? (
                        <picture className={styles.productPicture}>
                          <source 
                            media="(min-width: 768px)" 
                            srcSet={`${product.images[0]} 1x, ${product.images[0]} 2x`}
                          />
                          <img 
                            src={product.images[0]} 
                            srcSet={`${product.images[0]} 1x, ${product.images[0]} 2x`}
                            loading="lazy" 
                            alt={product.name}
                            className={styles.productImage}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </picture>
                      ) : (
                        <div className={styles.productPlaceholder}>No Image</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productBrandName}>
                      <span className={styles.productBrand}>
                        {product.category?.name || 'AURAPOP'}
                      </span>
                      <span className={styles.productName}>
                        {product.name}
                      </span>
                    </div>
                    <b className={styles.productPrice}>
                      <span>${product.price.toFixed(2)}</span>
                    </b>
                    <div className={styles.productRating}>
                      <span 
                        className={styles.starRating}
                        aria-label={`${rating} stars`}
                      >
                        <span className={styles.starContainer}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={styles.starEmpty}>★</span>
                          ))}
                        </span>
                        <span 
                          className={styles.starRatingFill}
                          style={{ width: `${ratingPercent}%` }}
                        >
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={styles.starFilled}>★</span>
                          ))}
                        </span>
                      </span>
                      <span className={styles.reviewCount} aria-label={`${reviewCount} reviews`}>
                        {reviewCount}
                      </span>
                    </div>
                  </div>

                  {isNew && (
                    <div className={styles.productBadge}>
                      <span className={styles.newBadge}>New</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
          
          {/* Hidden spacer for smooth scrolling */}
          <li aria-hidden="true" className={styles.spacerRight}></li>
        </ul>

        {/* Navigation Buttons */}
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
      </div>
    </section>
  );
};

export default ProductCarousel;

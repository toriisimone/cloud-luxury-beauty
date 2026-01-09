import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCarousel.module.css';

interface CarouselProduct {
  id: string;
  title: string;
  image: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  affiliate: string;
  badge?: string;
}

interface ProductCarouselProps {
  products: CarouselProduct[];
  title?: string;
}

const ProductCarousel = ({ products, title = 'Featured Products' }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 340; // Approximate card width with gap (320px card + 20px gap)
      const newIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 340; // Approximate card width with gap (320px card + 20px gap)
      const maxIndex = Math.max(0, products.length - 4); // Show 4 products at a time
      const newIndex = Math.min(maxIndex, currentIndex + 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleBuyOnAmazon = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate random rating if not provided
  const getRating = (product: CarouselProduct): string => {
    if (product.rating) return product.rating.toFixed(1);
    return (4.0 + Math.random() * 1.0).toFixed(1);
  };

  const getReviewCount = (product: CarouselProduct): number => {
    if (product.reviewCount) return product.reviewCount;
    return Math.floor(Math.random() * 500) + 50;
  };

  return (
    <section className={styles.carouselSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(products.length / 4) }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${Math.floor(currentIndex / 4) === i ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={styles.navButton}
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            aria-label="Previous products"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.carousel} ref={scrollContainerRef}>
            {products.map((product) => {
              const rating = parseFloat(getRating(product));
              const reviewCount = getReviewCount(product);
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 >= 0.5;

              return (
                <div key={product.id} className={styles.productCard}>
                  {product.badge && (
                    <div className={styles.badge}>
                      {product.badge.toLowerCase().includes("kylie's favorite") || product.badge.toLowerCase().includes("kylies favorite")
                        ? "Tori's favorite"
                        : product.badge}
                    </div>
                  )}
                  <div className={styles.imageContainer}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div className={styles.placeholder}>Product Image</div>';
                        }
                      }}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.title}</h3>
                    <div className={styles.rating}>
                      <div className={styles.stars}>
                        {Array.from({ length: fullStars }).map((_, i) => (
                          <span key={i} className={styles.star}>★</span>
                        ))}
                        {hasHalfStar && <span className={styles.starHalf}>★</span>}
                        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
                          <span key={i} className={styles.starEmpty}>☆</span>
                        ))}
                      </div>
                      <span className={styles.ratingText}>
                        {rating.toFixed(1)} ({reviewCount})
                      </span>
                    </div>
                    <div className={styles.price}>${product.price?.toFixed(2) || 'N/A'}</div>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleBuyOnAmazon(product.affiliate)}
                      data-hover-text={product.badge && product.badge.toLowerCase().includes("bundle") ? "view now" : "buy on amazon"}
                    >
                      {product.badge && product.badge.toLowerCase().includes("bundle") ? "view bundle" : "buy on amazon"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={styles.navButton}
            onClick={scrollRight}
            disabled={currentIndex >= Math.max(0, products.length - 4)}
            aria-label="Next products"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCarousel.module.css';

interface CarouselProduct {
  id: string;
  title: string;
  image: string;
  price?: number;
  originalPrice?: number; // For strikethrough pricing
  rating?: number;
  reviewCount?: number;
  affiliate: string;
  badge?: string;
  badges?: string[]; // Multiple badges support
  shadeCount?: number; // Number of shades available
  shadeColors?: string[]; // Color swatches for shades
}

interface ProductCarouselProps {
  products: CarouselProduct[];
  title?: string;
}

const ProductCarousel = ({ products, title = 'Featured Products' }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Duplicate products for infinite loop
  const duplicatedProducts = [...products, ...products, ...products];

  // Check scroll position to enable/disable buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Auto-scroll function
  const autoScroll = () => {
    if (scrollContainerRef.current && !isPaused) {
      const container = scrollContainerRef.current;
      // Get actual card width from first card or use responsive calculation
      const firstCard = container.querySelector('.productCard') as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 336; // Card width + gap
      const maxScroll = container.scrollWidth / 3; // Divide by 3 since we duplicated 3 times
      const currentScroll = container.scrollLeft;
      let newScroll = currentScroll + cardWidth;

      // Reset to beginning if we've scrolled past the first set of products
      if (newScroll >= maxScroll) {
        newScroll = 0;
        // Instantly jump to start (no animation) then continue
        container.scrollLeft = 0;
        setTimeout(() => {
          container.scrollTo({
            left: cardWidth,
            behavior: 'smooth',
          });
        }, 50);
        return;
      }

      container.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });

      const newIndex = Math.round(newScroll / cardWidth) % products.length;
      setCurrentIndex(newIndex);
    }
  };

  // Update scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [products]);

  // Auto-scroll effect
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current !== null) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Set up auto-scroll (4 seconds)
    if (!isPaused) {
      autoScrollIntervalRef.current = window.setInterval(() => {
        autoScroll();
      }, 4000);
    }

    return () => {
      if (autoScrollIntervalRef.current !== null) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isPaused]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector('.productCard') as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 336; // Card width + gap
      const scrollAmount = cardWidth;
      const maxScroll = container.scrollWidth / 3; // Divide by 3 for infinite loop
      let newScrollLeft = container.scrollLeft - scrollAmount;
      
      // Loop to end if at beginning
      if (newScrollLeft < 0) {
        newScrollLeft = maxScroll - cardWidth;
      }
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      
      // Update index based on actual scroll position
      const newIndex = Math.round(newScrollLeft / cardWidth) % products.length;
      setCurrentIndex(newIndex);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.querySelector('.productCard') as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 336; // Card width + gap
      const scrollAmount = cardWidth;
      const maxScroll = container.scrollWidth / 3; // Divide by 3 for infinite loop
      let newScrollLeft = container.scrollLeft + scrollAmount;
      
      // Reset to beginning if past the first set
      if (newScrollLeft >= maxScroll) {
        newScrollLeft = 0;
      }
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      
      // Update index based on actual scroll position
      const newIndex = Math.round(newScrollLeft / cardWidth) % products.length;
      setCurrentIndex(newIndex);
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
            disabled={!canScrollLeft}
            aria-label="Previous products"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div 
            className={styles.carousel} 
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedProducts.map((product, index) => {
              const rating = parseFloat(getRating(product));
              const reviewCount = getReviewCount(product);
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 >= 0.5;

              // Get all badges (support both single badge and badges array)
              const allBadges = product.badges || (product.badge ? [product.badge] : []);
              const isBundle = product.badge?.toLowerCase().includes("bundle") || product.badges?.some(b => b.toLowerCase().includes("bundle"));
              const hasShades = product.shadeCount && product.shadeCount > 0;

              return (
                <div key={`${product.id}-${index}`} className={styles.productCard}>
                  {/* Multiple badges support - Kylie style */}
                  {allBadges.length > 0 && (
                    <div className={styles.badgesContainer}>
                      {allBadges.map((badge, idx) => {
                        const badgeText = badge.toLowerCase().includes("kylie's favorite") || badge.toLowerCase().includes("kylies favorite")
                          ? "tori's favorite"
                          : badge.toLowerCase();
                        return (
                          <div key={idx} className={styles.badge}>
                            {badgeText}
                          </div>
                        );
                      })}
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
                    {/* Shade selection - Kylie style */}
                    {hasShades && (
                      <div className={styles.shadeSelection}>
                        <span className={styles.shadeText}>+{product.shadeCount} shades</span>
                        {product.shadeColors && product.shadeColors.length > 0 && (
                          <div className={styles.shadeSwatches}>
                            {product.shadeColors.slice(0, 6).map((color, idx) => (
                              <div
                                key={idx}
                                className={styles.shadeSwatch}
                                style={{ backgroundColor: color }}
                                title={`Shade ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Rating - Kylie style */}
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
                    
                    {/* Product name - lowercase Kylie style */}
                    <h3 className={styles.productName}>{product.title.toLowerCase()}</h3>
                    
                    {/* Price with strikethrough support - Kylie style */}
                    <div className={styles.priceContainer}>
                      {product.originalPrice && product.originalPrice > (product.price || 0) && (
                        <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                      )}
                      <span className={styles.price}>${product.price?.toFixed(2) || 'N/A'}</span>
                    </div>
                    
                    {/* Button with price - Kylie style */}
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleBuyOnAmazon(product.affiliate)}
                      data-hover-text={isBundle ? "view now" : "buy on amazon"}
                    >
                      {isBundle 
                        ? "view bundle" 
                        : `add to cart - $${product.price?.toFixed(2) || '0.00'}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={styles.navButton}
            onClick={scrollRight}
            disabled={scrollContainerRef.current ? 
              scrollContainerRef.current.scrollLeft >= 
              (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10) 
              : false
            }
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

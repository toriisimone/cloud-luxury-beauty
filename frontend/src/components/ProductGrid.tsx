import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/productData';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  showAds?: boolean;
  adInterval?: number;
}

const ProductGrid = ({ products, showAds = true, adInterval = 4 }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const formatReviewCount = (count?: number): string => {
    if (!count) return '';
    if (count >= 1000) {
      const k = count / 1000;
      if (k >= 10) {
        return `${Math.floor(k)}K`;
      }
      return `${k.toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
    const hasFullStar = decimal >= 0.75;
    const displayedFullStars = hasFullStar ? fullStars + 1 : fullStars;
    const emptyStars = 5 - displayedFullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className={styles.starsContainer}>
        <span className={styles.starsEmpty} aria-label={`${rating} stars`}>
          {'☆'.repeat(5)}
        </span>
        <span 
          className={styles.starsFilled} 
          style={{ width: `${(displayedFullStars / 5) * 100}%` }}
        >
          {'★'.repeat(displayedFullStars)}
          {hasHalfStar && '☆'}
        </span>
      </div>
    );
  };

  // Get product image path
  const getProductImagePath = (product: Product): string => {
    if (product.image) return product.image;
    const topSlug = product.topCategory.toLowerCase().replace(/\s+/g, '-');
    const subSlug = product.subCategory.toLowerCase().replace(/\s+/g, '-');
    return `/assets/images/products/${topSlug}/${subSlug}/${product.slug}.jpg`;
  };

  // Get ad image path
  const getAdImagePath = (index: number, topCategory: string, subCategory?: string): string => {
    const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
    if (subCategory) {
      const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      return `/assets/images/ads/${topSlug}/${subSlug}/ad-${index}.jpg`;
    }
    return `/assets/images/ads/${topSlug}/ad-${index}.jpg`;
  };

  // Render items with ads interleaved
  const renderGridItems = () => {
    const items: JSX.Element[] = [];
    let adIndex = 0;

    products.forEach((product, index) => {
      // Add product
      const isFavorite = favorites.has(product.id);
      items.push(
        <div key={product.id} className={styles.productTile}>
          <Link to={`/products/${product.id}`} className={styles.productTileLink}>
            <div className={styles.productImageContainer}>
              <picture className={styles.productPicture}>
                <img
                  src={getProductImagePath(product)}
                  alt={`${product.brand} - ${product.title}`}
                  className={styles.productImage}
                  loading="lazy"
                />
              </picture>
              <button type="button" className={styles.quicklookButton}>Quicklook</button>
            </div>
            <div className={styles.productContent}>
              <span className={styles.productBrand}>{product.brand}</span>
              <span className={styles.productTitle}>{product.title}</span>
              {product.colors && (
                <span className={styles.productColors}>{product.colors}</span>
              )}
              <div className={styles.productRatingContainer}>
                {renderStars(product.rating || 4.5)}
                {product.reviewCount && (
                  <span className={styles.reviewCount} aria-label={`${product.reviewCount} reviews`}>
                    {formatReviewCount(product.reviewCount)}
                  </span>
                )}
              </div>
              <b className={styles.productPrice}>
                {product.priceRange ? (
                  <span>
                    ${product.priceRange.min.toFixed(2)} - ${product.priceRange.max.toFixed(2)}
                  </span>
                ) : (
                  <span>${product.price.toFixed(2)}</span>
                )}
              </b>
              {product.sponsored && (
                <span className={styles.sponsoredLabel}>Sponsored</span>
              )}
              {product.badge && (
                <div className={styles.flagContainer}>
                  <span className={styles.flag}>{product.badge}</span>
                </div>
              )}
              <div className={styles.favoriteContainer}>
                <button
                  aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${product.title}`}
                  className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                  onClick={(e) => toggleFavorite(e, product.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.favoriteIcon}>
                    <path
                      d="M22 3.1c2.7 2.2 2.6 7.2.1 9.7-2.2 2.8-7.4 8.1-9.3 9.6-.5.4-1.1.4-1.6 0-1.8-1.5-7-6.8-9.2-9.6-2.6-2.6-2.7-7.6 0-9.7C4.6.5 9.7.7 12 4.2 14.3.8 19.3.5 22 3.1zm-.7.8c-2.4-2.4-7.2-2-8.9 1.5-.1.3-.4.4-.7.2-.1 0-.2-.1-.2-.2-1.6-3.5-6.5-4-8.9-1.5C.4 5.6.5 10 2.7 12.2c2.2 2.7 7.3 8 9.1 9.4.1.1.2.1.3 0 1.8-1.4 6.9-6.7 9.1-9.5 2.3-2.1 2.4-6.5.1-8.2z"
                      fill={isFavorite ? '#000' : 'none'}
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        </div>
      );

      // Add ad after every N products
      if (showAds && (index + 1) % adInterval === 0 && index < products.length - 1) {
        adIndex++;
        items.push(
          <div
            key={`ad-${adIndex}`}
            className={styles.adTile}
            data-type="ad-tile"
          >
            <div className={styles.adContainer}>
              <picture className={styles.adPicture}>
                <img
                  src={getAdImagePath(adIndex, products[0]?.topCategory || 'other', products[0]?.subCategory)}
                  alt="Promotional banner"
                  className={styles.adImage}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        );
      }
    });

    return items;
  };

  return (
    <div className={styles.productGrid}>
      {renderGridItems()}
    </div>
  );
};

export default ProductGrid;

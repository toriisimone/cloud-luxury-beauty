import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Skincare.module.css';

// Product interface
interface SkincareProduct {
  id: string;
  brand: string;
  title: string;
  price: number;
  priceRange?: { min: number; max: number };
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string;
  sponsored?: boolean;
}

const SKINCARE_PRODUCTS: SkincareProduct[] = [
  {
    id: "1",
    brand: "LANEIGE",
    title: "Water Bank Aqua Facial Serum BHA + AHA",
    price: 38.00,
    image: "https://www.sephora.com/productimages/sku/s2701234-main-zoom.jpg",
    badge: "New",
    rating: 4.6,
    reviewCount: 2100
  },
  {
    id: "2",
    brand: "Beauty of Joseon",
    title: "Revive Under Eye Patches",
    price: 34.00,
    image: "https://www.sephora.com/productimages/sku/s2689123-main-zoom.jpg",
    badge: "Clean",
    rating: 4.8,
    reviewCount: 980
  },
  {
    id: "3",
    brand: "The Ordinary",
    title: "Volufiline 92% + Pal‑Isoleucine 1% Plumping Serum",
    price: 14.00,
    image: "https://www.sephora.com/productimages/sku/s2670012-main-zoom.jpg",
    badge: "Online Only",
    rating: 4.4,
    reviewCount: 1500
  },
  {
    id: "4",
    brand: "innisfree",
    title: "Green Tea Ceramide Milk Toner",
    price: 23.00,
    image: "https://www.sephora.com/productimages/sku/s2657890-main-zoom.jpg",
    badge: "Clean",
    rating: 4.7,
    reviewCount: 1200
  },
  {
    id: "5",
    brand: "Caudalie",
    title: "Self‑Tan Hydrating Face Drops",
    price: 49.00,
    image: "https://www.sephora.com/productimages/sku/s2645561-main-zoom.jpg",
    badge: "Limited Edition",
    rating: 4.5,
    reviewCount: 860
  },
  {
    id: "6",
    brand: "Benefit Cosmetics",
    title: "The POREfessional Degunker Blackhead & Pore Cleansing Mask System",
    price: 39.00,
    image: "https://www.sephora.com/productimages/sku/s2634417-main-zoom.jpg",
    badge: "New",
    rating: 4.3,
    reviewCount: 600
  },
  {
    id: "7",
    brand: "OLEHENRIKSEN",
    title: "Pout Preserve Hydrating Peptide Lip Treatment",
    price: 22.00,
    image: "https://www.sephora.com/productimages/sku/s2623340-main-zoom.jpg",
    badge: "Clean",
    rating: 4.6,
    reviewCount: 1400
  }
];

const Skincare = () => {
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

  const formatReviewCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
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
      <div className={styles.stars}>
        {'★'.repeat(displayedFullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(Math.max(0, emptyStars))}
      </div>
    );
  };

  return (
    <div className={styles.skincarePage}>
      {/* Back to Top Button */}
      <button className={styles.backToTop}>Back to Top</button>

      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Skincare</h1>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {SKINCARE_PRODUCTS.map((product) => {
            const isFavorite = favorites.has(product.id);
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={styles.productCard}
              >
                {/* Favorite Heart Button */}
                <button
                  className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                  onClick={(e) => toggleFavorite(e, product.id)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? '#000' : 'none'}
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* Product Image */}
                <div className={styles.productImageWrapper}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.productImage}
                  />
                  {/* Badge Overlay */}
                  {product.badge && (
                    <div className={styles.badgeContainer}>
                      <span className={styles.productBadge}>{product.badge}</span>
                    </div>
                  )}
                  {product.sponsored && (
                    <div className={styles.badgeContainer}>
                      <span className={styles.sponsoredBadge}>Sponsored</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={styles.productInfo}>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  {product.colors && (
                    <p className={styles.productColors}>{product.colors} Colors</p>
                  )}
                  <div className={styles.productPrice}>
                    {product.priceRange ? (
                      <>${product.priceRange.min.toFixed(2)} - ${product.priceRange.max.toFixed(2)}</>
                    ) : (
                      <>${product.price.toFixed(2)}</>
                    )}
                  </div>
                  {product.rating !== undefined && (
                    <div className={styles.productRating}>
                      {renderStars(product.rating)}
                      {product.reviewCount && (
                        <span className={styles.reviewCount}>
                          {formatReviewCount(product.reviewCount)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Skincare;

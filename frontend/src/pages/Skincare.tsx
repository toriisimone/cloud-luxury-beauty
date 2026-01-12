import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Skincare.module.css';

// Product interface
interface SkincareProduct {
  id: string;
  brand: string;
  title: string;
  price: number;
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

// Category interface
interface Category {
  name: string;
  count: number;
}

// Skincare categories (left sidebar)
const SKINCARE_CATEGORIES: Category[] = [
  { name: 'Cleansers', count: 145 },
  { name: 'Moisturizers', count: 282 },
  { name: 'Serums', count: 198 },
  { name: 'Eye Care', count: 156 },
  { name: 'Face Masks', count: 134 },
  { name: 'Sunscreen', count: 89 },
  { name: 'Toners', count: 112 },
  { name: 'Exfoliants', count: 76 },
  { name: 'Face Oils', count: 98 },
  { name: 'Acne Treatment', count: 124 },
  { name: 'Anti-Aging', count: 201 },
  { name: 'Brightening', count: 167 },
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const products = SKINCARE_PRODUCTS; // Will be populated with your product array

  return (
    <div className={styles.skincarePage}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Skincare</h1>
          {products.length > 0 && (
            <p className={styles.productCount}>{products.length} products</p>
          )}
        </div>

        {/* Main Content Layout */}
        <div className={styles.mainLayout}>
          {/* Left Sidebar - Categories */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <h2 className={styles.sidebarTitle}>Filters</h2>
              <nav className={styles.categoryNav}>
                {SKINCARE_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    className={`${styles.categoryItem} ${
                      selectedCategory === category.name ? styles.categoryItemActive : ''
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>({category.count})</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className={styles.contentArea}>
            {/* Promotional Banner */}
            <div className={styles.promotionalBanner}>
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>Glow Starts Here.</h2>
                <p className={styles.bannerSubtitle}>
                  Hydrate, treat, and transform with these skincare picks.
                </p>
                <button className={styles.bannerCta}>SHOP NOW ▶</button>
              </div>
              <div className={styles.bannerBadge}>
                <span>ONLY AT CLOUD LUXURY BEAUTY</span>
              </div>
              {/* Banner images placeholder - add your skincare product images here */}
              <div className={styles.bannerImages}>
                <div className={styles.bannerImagePlaceholder}></div>
                <div className={styles.bannerImagePlaceholder}></div>
                <div className={styles.bannerImagePlaceholder}></div>
              </div>
        </div>

            {/* Products Grid */}
            <div className={styles.productsSection}>
              {products.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No products available yet. Product data will be added soon.</p>
                </div>
              ) : (
                <div className={styles.productsGrid}>
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productImageWrapper}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                          className={styles.productImage}
                        />
                        {product.badge && (
                          <span className={styles.productBadge}>{product.badge}</span>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <p className={styles.productBrand}>{product.brand}</p>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
                        {product.rating !== undefined && (
                          <div className={styles.productRating}>
                            <div className={styles.stars}>
                              {'★'.repeat(Math.floor(product.rating))}
                              {'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            {product.reviewCount !== undefined && (
                              <span className={styles.reviewCount}>
                                {product.reviewCount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                </div>
                    </Link>
                  ))}
                </div>
              )}
              </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Skincare;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TopCategory, getCategoryStructure, Product, loadAllProducts, getProductsByCategory } from '../data/productData';
import styles from './MegaMenu.module.css';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: TopCategory | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MegaMenu = ({ isOpen, onClose, activeCategory, onMouseEnter, onMouseLeave }: MegaMenuProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(activeCategory);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const categories = getCategoryStructure();

  // Load products from CSV on mount
  useEffect(() => {
    const loadProducts = async () => {
      if (!productsLoaded) {
        const products = await loadAllProducts();
        setAllProducts(products);
        setProductsLoaded(true);
      }
    };
    loadProducts();
  }, [productsLoaded]);

  // Update hovered category when activeCategory changes
  useEffect(() => {
    setHoveredCategory(activeCategory);
  }, [activeCategory]);

  // Category display names mapping
  const categoryNames: Record<TopCategory, string> = {
    'Skincare': 'Skincare',
    'Makeup': 'Makeup',
    'Hair': 'Hair',
    'Fragrance': 'Fragrance',
    'Body': 'Body',
    'Tools & Brushes': 'Tools & Brushes',
    'Gifts & Sets': 'Gifts & Sets',
    'Minis': 'Minis',
    'Limited Edition': 'Limited Edition',
    'Online Only': 'Online Only',
    'Other': 'Other'
  };

  // Get image path for category tile
  const getCategoryImagePath = (category: TopCategory, subCategory?: string): string => {
    if (subCategory) {
      const topSlug = category.toLowerCase().replace(/\s+/g, '-');
      const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      return `/assets/images/menu/${topSlug}/${subSlug}.jpg`;
    }
    return `/assets/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/tile.jpg`;
  };

  // Get image path for banner
  const getBannerImagePath = (category: TopCategory): string => {
    return `/assets/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/banner.jpg`;
  };

  const getCategoryUrl = (category: TopCategory): string => {
    return `/category/${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const getSubCategoryUrl = (topCategory: TopCategory, subCategory: string): string => {
    const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
    const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
    return `/category/${topSlug}/${subSlug}`;
  };

  // Get products for a specific category/subcategory
  const getCategoryProducts = (topCategory: TopCategory, subCategory?: string, limit: number = 4): Product[] => {
    const categoryProducts = getProductsByCategory(allProducts, topCategory, subCategory);
    return categoryProducts.slice(0, limit);
  };

  // Format price
  const formatPrice = (product: Product): string => {
    if (product.priceRange) {
      return `$${product.priceRange.min.toFixed(2)} - $${product.priceRange.max.toFixed(2)}`;
    }
    return `$${product.price.toFixed(2)}`;
  };

  // Format review count
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

  // Render stars
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
    const hasFullStar = decimal >= 0.75;
    const displayedFullStars = hasFullStar ? fullStars + 1 : fullStars;

    return (
      <div className={styles.categoryStarsContainer}>
        <span className={styles.categoryStarsEmpty} aria-label={`${rating} stars`}>
          {'☆'.repeat(5)}
        </span>
        <span 
          className={styles.categoryStarsFilled} 
          style={{ width: `${(displayedFullStars / 5) * 100}%` }}
        >
          {'★'.repeat(displayedFullStars)}
          {hasHalfStar && '☆'}
        </span>
      </div>
    );
  };

  // Get active category data
  const activeCategoryData = activeCategory 
    ? categories.find(cat => cat.topCategory === activeCategory)
    : null;

  if (!isOpen || !activeCategoryData || !activeCategory) {
    return null;
  }

  // TypeScript now knows activeCategory is not null
  const currentCategory: TopCategory = activeCategory;

  return (
    <div 
      className={`${styles.megaMenu} ${isOpen ? styles.open : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.megaMenuWrapper}>
        <div className={styles.megaMenuGrid}>
          <div className={styles.megaMenuMain}>
            <div className={styles.megaMenuImageMenuBlocks}>
              {activeCategoryData.subCategories.slice(0, 8).map((subCategory) => {
                // Get products for this subcategory
                const subCategoryProducts = getCategoryProducts(currentCategory, subCategory, 4);
                
                return (
                  <div
                    key={subCategory}
                    className={styles.imageMenuBlock}
                  >
                    <Link
                      to={getSubCategoryUrl(currentCategory, subCategory)}
                      className={styles.imageMenuBlockTitleLink}
                      onClick={onClose}
                      rel="follow"
                      data-level="2"
                      data-track-title={subCategory}
                      data-parent-title={subCategory}
                      data-grand-title={currentCategory}
                    >
                      <div 
                        className={styles.responsiveImage}
                        style={{
                          '--aspect-ratio': '100.0%',
                          '--max-height': '200px',
                          '--max-width': '200px',
                          '--object-fit': 'cover',
                          '--object-position': 'center'
                        } as React.CSSProperties}
                        tabIndex={0}
                      >
                        <img
                          src={getCategoryImagePath(currentCategory, subCategory)}
                          alt={subCategory}
                          className={styles.imageMenuBlockImage}
                          loading="lazy"
                          width="200"
                          height="200"
                          tabIndex={-1}
                        />
                      </div>
                      <h2 className={styles.imageMenuBlockTitle}>
                        {subCategory}
                      </h2>
                    </Link>
                    
                    {/* Product Grid for this subcategory - Sephora Style */}
                    {subCategoryProducts.length > 0 && (
                      <div className={styles.categoryProductGrid}>
                        {subCategoryProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.slug}`}
                            className={styles.categoryProductTile}
                            onClick={onClose}
                          >
                            <div className={styles.categoryProductImageContainer}>
                              <img
                                src={product.image || product.imageUrl || ''}
                                alt={`${product.brand} - ${product.title}`}
                                className={styles.categoryProductImage}
                                loading="lazy"
                              />
                            </div>
                            <div className={styles.categoryProductContent}>
                              <span className={styles.categoryProductBrand}>{product.brand}</span>
                              <span className={styles.categoryProductTitle}>{product.title}</span>
                              <div className={styles.categoryProductRating}>
                                {renderStars(product.rating || 4.5)}
                                {product.reviewCount && (
                                  <span className={styles.categoryReviewCount}>
                                    {formatReviewCount(product.reviewCount)}
                                  </span>
                                )}
                              </div>
                              <b className={styles.categoryProductPrice}>{formatPrice(product)}</b>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.megaMenuButtons}></div>
            <div className={styles.megaMenuSecondaryLinksBlocks}></div>
          </div>
          <div className={styles.megaMenuAside}>
            <div className={styles.bannerBlock}>
              <Link
                to={getCategoryUrl(currentCategory)}
                className={styles.bannerBlockLink}
                onClick={onClose}
                rel="follow"
              >
                <div 
                  className={styles.bannerResponsiveImage}
                  style={{
                    '--aspect-ratio': '108.19672131147541%',
                    '--max-height': '660px',
                    '--max-width': '610px',
                    '--object-fit': 'cover',
                    '--object-position': 'center'
                  } as React.CSSProperties}
                  tabIndex={0}
                >
                  <img
                    src={getBannerImagePath(currentCategory)}
                    alt={categoryNames[currentCategory]}
                    className={styles.bannerBlockImage}
                    loading="eager"
                    fetchPriority="high"
                    width="610"
                    height="660"
                    tabIndex={-1}
                  />
                </div>
                <div className={styles.bannerBlockTitle}>
                  {categoryNames[currentCategory]}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

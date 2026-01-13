import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TopCategory, getCategoryStructure, getProductsByCategory, loadAllProducts, Product } from '../data/productData';
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
  const categories = getCategoryStructure();

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      const products = await loadAllProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

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

  // Get image path for category tile with fallback
  const getCategoryImagePath = (category: TopCategory, subCategory?: string): string => {
    if (subCategory) {
      const topSlug = category.toLowerCase().replace(/\s+/g, '-');
      const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      const path = `/assets/images/menu/${topSlug}/${subSlug}.jpg`;
      // Return path - if image doesn't exist, browser will show broken image, we'll handle with CSS
      return path;
    }
    return `/assets/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/tile.jpg`;
  };

  // Get image path for banner with fallback
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

  // Get products for a subcategory to show as menu items
  const getSubCategoryProducts = (topCategory: TopCategory, subCategory: string, limit: number = 4): Product[] => {
    const products = getProductsByCategory(allProducts, topCategory, subCategory);
    return products.slice(0, limit);
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
            {/* Shop All Link */}
            <div className={styles.megaMenuShopAll}>
              <Link
                to={getCategoryUrl(currentCategory)}
                className={styles.megaMenuShopAllLink}
                onClick={onClose}
                rel="follow"
              >
                Shop All {categoryNames[currentCategory]}
              </Link>
            </div>

            <div className={styles.megaMenuImageMenuBlocks}>
              {activeCategoryData.subCategories.slice(0, 8).map((subCategory) => {
                const subCategoryProducts = getSubCategoryProducts(currentCategory, subCategory, 4);
                
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
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <h2 className={styles.imageMenuBlockTitle}>
                        {subCategory}
                      </h2>
                    </Link>
                    
                    {/* Menu items for subcategory - Kylie's structure */}
                    {subCategoryProducts.length > 0 && (
                      <ul className={styles.imageMenuBlockMenu}>
                        {subCategoryProducts.map((product) => (
                          <li key={product.id} className={styles.imageMenuBlockMenuItem}>
                            <Link
                              to={`/products/${product.slug}`}
                              data-level="3"
                              data-track-title={product.title}
                              data-parent-title={subCategory}
                              data-grand-title={currentCategory}
                              data-track-url={product.title}
                              rel="follow"
                              className={styles.imageMenuBlockMenuItemLink}
                              onClick={onClose}
                            >
                              {product.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
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
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="610" height="660"%3E%3Crect width="610" height="660" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3EBanner Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className={styles.bannerBlockTitle}>
                  {categoryNames[currentCategory].toLowerCase()}
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

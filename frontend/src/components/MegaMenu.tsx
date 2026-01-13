import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TopCategory, getCategoryStructure } from '../data/productData';
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
  const categories = getCategoryStructure();

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
                    {/* Menu items for subcategory - Kylie's structure */}
                    <ul className={styles.imageMenuBlockMenu}>
                      {/* Subcategory links can be added here if needed */}
                    </ul>
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

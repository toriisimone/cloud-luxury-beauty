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
  const getCategoryImagePath = (category: TopCategory): string => {
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

  // Filter categories to show only the active category's subcategories
  const activeCategoryData = categories.find(cat => cat.topCategory === activeCategory);
  const displayCategories = activeCategoryData 
    ? [{ topCategory: activeCategoryData.topCategory, subCategories: activeCategoryData.subCategories }]
    : [];

  // If no active category, show all categories (fallback)
  const categoriesToShow = activeCategory ? displayCategories : categories;

  return (
    <>
      <div 
        className={`${styles.megaMenu} ${isOpen ? styles.open : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.megaMenuWrapper}>
          <div className={styles.megaMenuGrid}>
            <div className={styles.megaMenuMain}>
              <div className={styles.imageMenuBlocks}>
                {categoriesToShow.map((category) => {
                  return (
                    <div
                      key={category.topCategory}
                      className={styles.imageMenuBlock}
                      onMouseEnter={() => setHoveredCategory(category.topCategory)}
                      onMouseLeave={() => setHoveredCategory(activeCategory)}
                    >
                      <Link
                        to={getCategoryUrl(category.topCategory)}
                        className={styles.imageMenuBlockTitleLink}
                        onClick={onClose}
                        rel="follow"
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
                        >
                          <img
                            src={getCategoryImagePath(category.topCategory)}
                            alt={categoryNames[category.topCategory]}
                            className={styles.imageMenuBlockImage}
                            loading="lazy"
                            width="200"
                            height="200"
                          />
                        </div>
                        <h2 className={styles.imageMenuBlockTitle}>
                          {categoryNames[category.topCategory]}
                        </h2>
                      </Link>
                      {category.subCategories.length > 0 && (
                        <ul className={styles.imageMenuBlockMenu}>
                          {category.subCategories.slice(0, 10).map((subCategory) => (
                            <li key={subCategory} className={styles.imageMenuBlockMenuItem}>
                              <Link
                                to={getSubCategoryUrl(category.topCategory, subCategory)}
                                className={styles.imageMenuBlockMenuItemLink}
                                onClick={onClose}
                                rel="follow"
                              >
                                {subCategory}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.megaMenuAside}>
              {(hoveredCategory || activeCategory) && (
                <div className={styles.bannerBlock}>
                  <Link
                    to={getCategoryUrl(hoveredCategory || activeCategory!)}
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
                    >
                      <img
                        src={getBannerImagePath(hoveredCategory || activeCategory!)}
                        alt={categoryNames[hoveredCategory || activeCategory!]}
                        className={styles.bannerBlockImage}
                        loading="eager"
                        fetchPriority="high"
                        width="610"
                        height="660"
                      />
                    </div>
                    <div className={styles.bannerBlockTitle}>
                      {categoryNames[hoveredCategory || activeCategory!]}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;

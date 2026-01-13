import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopCategory, getCategoryStructure } from '../data/productData';
import styles from './MegaMenu.module.css';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);
  const categories = getCategoryStructure();

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

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.megaMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.megaMenuWrapper}>
          <div className={styles.megaMenuGrid}>
            <div className={styles.megaMenuMain}>
              <div className={styles.imageMenuBlocks}>
                {categories.map((category) => {
                  const isHovered = hoveredCategory === category.topCategory;
                  return (
                    <div
                      key={category.topCategory}
                      className={styles.imageMenuBlock}
                      onMouseEnter={() => setHoveredCategory(category.topCategory)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <Link
                        to={getCategoryUrl(category.topCategory)}
                        className={styles.imageMenuBlockTitleLink}
                        onClick={onClose}
                      >
                        <div className={styles.responsiveImage}>
                          <img
                            src={getCategoryImagePath(category.topCategory)}
                            alt={categoryNames[category.topCategory]}
                            className={styles.imageMenuBlockImage}
                            loading="lazy"
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
              {hoveredCategory && (
                <div className={styles.bannerBlock}>
                  <Link
                    to={getCategoryUrl(hoveredCategory)}
                    className={styles.bannerBlockLink}
                    onClick={onClose}
                  >
                    <div className={styles.bannerResponsiveImage}>
                      <img
                        src={getBannerImagePath(hoveredCategory)}
                        alt={categoryNames[hoveredCategory]}
                        className={styles.bannerBlockImage}
                        loading="eager"
                      />
                    </div>
                    <div className={styles.bannerBlockTitle}>
                      {categoryNames[hoveredCategory]}
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

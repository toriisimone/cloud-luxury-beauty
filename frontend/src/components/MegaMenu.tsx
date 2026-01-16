import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
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
    'Body': 'Body'
  };

  // Get image path for category tile with fallback
  const getCategoryImagePath = (category: TopCategory, subCategory?: string): string => {
    if (subCategory) {
      const topSlug = category.toLowerCase().replace(/\s+/g, '-');
      const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      const path = `/images/menu/${topSlug}/${subSlug}.jpg`;
      // Return path - if image doesn't exist, browser will show broken image, we'll handle with CSS
      return path;
    }
    return `/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/tile.jpg`;
  };

  // Get image path for banner with fallback
  const getBannerImagePath = (category: TopCategory): string => {
    return `/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/banner.jpg`;
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
                        } as unknown as CSSProperties}
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
                            const img = e.currentTarget;
                            const topSlug = currentCategory.toLowerCase().replace(/\s+/g, '-');
                            const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
                            const idx = Number(img.dataset.srcIndex || '0');
                            const candidates = [
                              `/images/menu/${topSlug}/${subSlug}.jpg`,
                              `/images/menu/${topSlug}/${subSlug}.png`,
                              `/images/menu/${topSlug}/${subSlug}.jpeg`,
                              `/assets/images/menu/${topSlug}/${subSlug}.jpg`,
                              `/assets/images/menu/${topSlug}/${subSlug}.png`,
                              `/assets/images/menu/${topSlug}/${subSlug}.jpeg`,
                            ];
                            const nextIdx = idx + 1;
                            if (nextIdx < candidates.length) {
                              img.dataset.srcIndex = String(nextIdx);
                              img.src = candidates[nextIdx];
                            } else {
                              img.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                            }
                          }}
                        />
                      </div>
                      <h2 className={styles.imageMenuBlockTitle}>
                        {subCategory}
                      </h2>
                    </Link>
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
                  } as unknown as CSSProperties}
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
                      const img = e.currentTarget;
                      const slug = currentCategory.toLowerCase().replace(/\s+/g, '-');
                      const idx = Number(img.dataset.srcIndex || '0');
                      const candidates = [
                        `/images/menu/${slug}/banner.jpg`,
                        `/images/menu/${slug}/banner.png`,
                        `/images/menu/${slug}/banner.jpeg`,
                        `/assets/images/menu/${slug}/banner.jpg`,
                        `/assets/images/menu/${slug}/banner.png`,
                        `/assets/images/menu/${slug}/banner.jpeg`,
                      ];
                      const nextIdx = idx + 1;
                      if (nextIdx < candidates.length) {
                        img.dataset.srcIndex = String(nextIdx);
                        img.src = candidates[nextIdx];
                      } else {
                        img.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="610" height="660"%3E%3Crect width="610" height="660" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3EBanner Image%3C/text%3E%3C/svg%3E';
                      }
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

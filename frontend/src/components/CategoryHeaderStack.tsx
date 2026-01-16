import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryHeaderStack.module.css';

type Tile = {
  key: string;
  label: string;
  slug: string;
  imageBaseName: string; // without extension
};

type Props = {
  /** Used to select banner image file. e.g. "skincare" -> skincare-banner.jpg/png */
  bannerKey: string;
  /** Large overlay title on banner (e.g. "SKINCARE") */
  bannerTitle: string;
  /** Breadcrumb second segment (lowercase) (e.g. "skincare") */
  breadcrumbLabel: string;
  /** Total products count */
  productCount: number;
  /** Used for building tile hrefs: /category/{baseCategorySlug}/{tileSlug} */
  baseCategorySlug: string;
};

const tiles: Tile[] = [
  { key: 'new', label: 'new', slug: 'new', imageBaseName: 'new-category' },
  { key: 'best-sellers', label: 'best sellers', slug: 'best-sellers', imageBaseName: 'best-sellers-category' },
  { key: 'lips', label: 'lips', slug: 'lips', imageBaseName: 'lips-category' },
  { key: 'face', label: 'face', slug: 'face', imageBaseName: 'face-category' },
  { key: 'eyes-brows', label: 'eyes & brows', slug: 'eyes-brows', imageBaseName: 'eyes-brows-category' },
  { key: 'featured', label: 'featured', slug: 'featured', imageBaseName: 'featured-category' },
];

const CategoryHeaderStack = ({ bannerKey, bannerTitle, breadcrumbLabel, productCount, baseCategorySlug }: Props) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const hrefFor = useMemo(() => {
    return (tileSlug: string) => `/category/${baseCategorySlug}/${tileSlug}`;
  }, [baseCategorySlug]);

  const bannerSources = useMemo(
    () => [
      `/images/category-banners/${bannerKey}-banner.jpg`,
      `/images/category-banners/${bannerKey}-banner.png`,
      // Fallback for legacy uploads directly under /images/
      `/images/${bannerKey}-banner.jpg`,
      `/images/${bannerKey}-banner.png`,
    ],
    [bannerKey]
  );

  return (
    <section className={styles.stack} aria-label="Category header">
      {/* Banner */}
      <div className={styles.banner}>
        <img
          className={styles.bannerImage}
          src={bannerSources[0]}
          alt={bannerTitle}
          onError={(e) => {
            const img = e.currentTarget;
            const idx = Number(img.dataset.srcIndex || '0');
            const nextIdx = idx + 1;
            if (nextIdx < bannerSources.length) {
              img.dataset.srcIndex = String(nextIdx);
              img.src = bannerSources[nextIdx];
            }
          }}
        />
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerTitle}>{bannerTitle}</div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbMuted}>home</span>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{breadcrumbLabel}</span>
      </div>

      {/* 6 tiles */}
      <div className={styles.tiles} aria-label="Category tiles">
        {tiles.map((t) => (
          <Link key={t.key} to={hrefFor(t.slug)} className={styles.tile}>
            <div className={styles.tileImageWrap}>
              <img
                className={styles.tileImage}
                src={`/images/categories/${t.imageBaseName}.jpg`}
                alt={t.label}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.jpg')) img.src = `/images/categories/${t.imageBaseName}.png`;
                }}
              />
            </div>
            <div className={styles.tileLabel}>{t.label}</div>
          </Link>
        ))}
      </div>

      {/* Count + boxed controls */}
      <div className={styles.controlsRow} aria-label="Category controls">
        <div className={styles.count}>{productCount} products</div>
        <div className={styles.controls}>
          <div className={styles.controlWrap}>
            <button
              type="button"
              className={styles.controlBtn}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => {
                setSortOpen((v) => !v);
                setFilterOpen(false);
              }}
            >
              sort by: featured
              <span className={styles.chev}>▾</span>
            </button>
            {sortOpen && (
              <div className={styles.dropdown} role="listbox" aria-label="Sort options">
                <button type="button" className={styles.dropdownItem} onClick={() => setSortOpen(false)}>
                  featured
                </button>
                <button type="button" className={styles.dropdownItem} onClick={() => setSortOpen(false)}>
                  relevance
                </button>
                <button type="button" className={styles.dropdownItem} onClick={() => setSortOpen(false)}>
                  price: low to high
                </button>
                <button type="button" className={styles.dropdownItem} onClick={() => setSortOpen(false)}>
                  price: high to low
                </button>
              </div>
            )}
          </div>

          <div className={styles.controlWrap}>
            <button
              type="button"
              className={styles.controlBtn}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              onClick={() => {
                setFilterOpen((v) => !v);
                setSortOpen(false);
              }}
            >
              filter
            </button>
            {filterOpen && (
              <div className={styles.dropdown} role="dialog" aria-label="Filter panel">
                <div className={styles.dropdownHint}>Filter UI placeholder (hook into facets next).</div>
                <button type="button" className={styles.dropdownItem} onClick={() => setFilterOpen(false)}>
                  close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHeaderStack;


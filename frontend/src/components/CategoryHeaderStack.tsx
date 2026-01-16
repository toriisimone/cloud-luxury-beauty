import { useEffect, useMemo, useState } from 'react';
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
  const [useVideoBanner, setUseVideoBanner] = useState(true);

  const hrefFor = useMemo(() => {
    return (tileSlug: string) => `/category/${baseCategorySlug}/${tileSlug}`;
  }, [baseCategorySlug]);

  const bannerSources = useMemo(
    () => [
      // Source of truth: /images/category-banners/
      `/images/category-banners/${bannerKey}-banner.jpg`,
      `/images/category-banners/${bannerKey}-banner.png`,
      // Also support /assets/images/menu/<category>/ (matches your current upload location)
      `/assets/images/menu/${bannerKey}/${bannerKey}-banner.jpg`,
      `/assets/images/menu/${bannerKey}/${bannerKey}-banner.png`,
    ],
    [bannerKey]
  );

  // Video banner support (MP4) for main categories; safe fallback to image.
  const shouldTryVideoBanner = ['skincare', 'makeup', 'hair', 'fragrance', 'body'].includes(bannerKey);
  const bannerVideoSources = useMemo(
    () => [
      `/images/category-banners/${bannerKey}-banner.mp4`,
      `/assets/images/menu/${bannerKey}/${bannerKey}-banner.mp4`,
    ],
    [bannerKey]
  );

  // Preload banner + tiles so the page feels instant.
  useEffect(() => {
    const urls = [
      ...bannerSources,
      `/images/categories/new-category.jpg`,
      `/images/categories/new-category.png`,
      `/images/categories/best-sellers-category.jpg`,
      `/images/categories/best-sellers-category.png`,
      `/images/categories/lips-category.jpg`,
      `/images/categories/lips-category.png`,
      `/images/categories/face-category.jpg`,
      `/images/categories/face-category.png`,
      `/images/categories/eyes-brows-category.jpg`,
      `/images/categories/eyes-brows-category.png`,
      `/images/categories/featured-category.jpg`,
      `/images/categories/featured-category.png`,
    ];

    // Warm cache with Image objects
    const imgs: HTMLImageElement[] = [];
    urls.forEach((href) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = href;
      imgs.push(img);
    });

    // Hint preload for banner (highest priority)
    const links: HTMLLinkElement[] = [];
    bannerSources.forEach((href, i) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      link.fetchPriority = i === 0 ? 'high' : 'low';
      document.head.appendChild(link);
      links.push(link);
    });

    // Hint preload for video banner (if enabled)
    if (shouldTryVideoBanner && bannerVideoSources[0]) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = bannerVideoSources[0];
      link.type = 'video/mp4';
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      links.forEach((l) => l.parentNode?.removeChild(l));
    };
  }, [bannerSources, bannerVideoSources, shouldTryVideoBanner]);

  return (
    <section className={styles.stack} aria-label="Category header">
      {/* Banner */}
      <div className={styles.banner} data-banner-key={bannerKey}>
        <div className={styles.bannerMediaWrap}>
          {shouldTryVideoBanner && useVideoBanner ? (
            <video
              className={styles.bannerMedia}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={bannerSources[1] || bannerSources[0]}
              onError={() => setUseVideoBanner(false)}
            >
              {bannerVideoSources.map((src) => (
                <source key={src} src={src} type="video/mp4" />
              ))}
            </video>
          ) : (
            <img
              className={styles.bannerMedia}
              src={bannerSources[0]}
              alt={bannerTitle}
              loading="eager"
              fetchPriority="high"
              decoding="async"
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
          )}
        </div>
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
                loading="eager"
                decoding="async"
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


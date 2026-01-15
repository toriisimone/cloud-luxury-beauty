import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryTileGrid.module.css';

type Tile = {
  key: string;
  label: string;
  slug: string;
  imageBaseName: string; // without extension
};

type Props = {
  baseCategorySlug?: string | null;
};

const tiles: Tile[] = [
  { key: 'new', label: 'new', slug: 'new', imageBaseName: 'new-category' },
  { key: 'best-sellers', label: 'best sellers', slug: 'best-sellers', imageBaseName: 'best-sellers-category' },
  { key: 'lips', label: 'lips', slug: 'lips', imageBaseName: 'lips-category' },
  { key: 'face', label: 'face', slug: 'face', imageBaseName: 'face-category' },
  { key: 'eyes-brows', label: 'eyes & brows', slug: 'eyes-brows', imageBaseName: 'eyes-brows-category' },
  { key: 'featured', label: 'featured', slug: 'featured', imageBaseName: 'featured-category' },
];

const CategoryTileGrid = ({ baseCategorySlug }: Props) => {
  const base = (baseCategorySlug || '').trim().toLowerCase();

  const hrefFor = useMemo(() => {
    return (tileSlug: string) => {
      // Keep this grid "category-page local": it stays within the current category route.
      // The existing CategoryPage will treat the second segment as a filter term.
      if (base) return `/category/${base}/${tileSlug}`;
      return `/category/${tileSlug}`;
    };
  }, [base]);

  return (
    <section className={styles.wrap} aria-label="Category quick links">
      <div className={styles.grid}>
        {tiles.map((t) => (
          <Link key={t.key} to={hrefFor(t.slug)} className={styles.tile}>
            <div className={styles.imageWrap}>
              <img
                className={styles.image}
                src={`/images/categories/${t.imageBaseName}.jpg`}
                alt={t.label}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  // Support PNG uploads without changing code: try .png if .jpg isn't present.
                  if (img.src.endsWith('.jpg')) img.src = `/images/categories/${t.imageBaseName}.png`;
                }}
              />
            </div>
            <div className={styles.label}>{t.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryTileGrid;


import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import * as productsApi from '../api/productsApi';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoadError('Missing product id in URL.');
        setLoading(false);
        return;
      }
      try {
        setLoadError(null);
        const data = await productsApi.getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id);
        }
        setActiveImageIndex(0);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
        setLoadError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    addItem(product, variant, quantity);
    navigate('/cart');
  };

  if (loading) {
    return <Loader />;
  }

  if (loadError) {
    return <div className={styles.error}>{loadError}</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  const price = selectedVariant
    ? product.variants?.find((v) => v.id === selectedVariant)?.price || product.price
    : product.price;

  const images = (product.images || []).filter((x): x is string => typeof x === 'string' && x.length > 0);
  const activeImage = images[activeImageIndex] || images[0] || null;

  const sizeText = useMemo(() => {
    const v = product.variants?.find((vv) => vv.id === selectedVariant);
    if (!v) return null;
    const isSize = v.name?.toLowerCase() === 'size';
    return isSize ? v.value : null;
  }, [product.variants, selectedVariant]);

  const extras = product as unknown as {
    rating?: number;
    reviewCount?: number;
    highlights?: string[];
    shortDescription?: string;
  };

  const highlights = Array.isArray(extras.highlights) ? extras.highlights.filter(Boolean) : [];
  const rating = typeof extras.rating === 'number' ? extras.rating : null;
  const reviewCount = typeof extras.reviewCount === 'number' ? extras.reviewCount : null;

  return (
    <div className={styles.details}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left thumbnails */}
          <aside className={styles.thumbs} aria-label="Product images">
            {images.length > 1 &&
              images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  className={`${styles.thumbButton} ${idx === activeImageIndex ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={src} alt="" className={styles.thumbImage} loading="lazy" />
                </button>
              ))}
          </aside>

          {/* Main image */}
          <section className={styles.imageStage}>
            <div className={styles.mainImageFrame}>
              {activeImage ? (
                <img src={activeImage} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.placeholder}>No Image</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowLeft}`}
                    aria-label="Previous image"
                    onClick={() => setActiveImageIndex((i) => (i - 1 + images.length) % images.length)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowRight}`}
                    aria-label="Next image"
                    onClick={() => setActiveImageIndex((i) => (i + 1) % images.length)}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Right info */}
          <section className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>

            {/* Clean info block (no fulfillment/shipping UI) */}
            <div className={styles.infoBlock}>
              <div className={styles.priceRow}>
                <div className={styles.price}>${price.toFixed(2)}</div>
              </div>

              {sizeText && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Size:</span>
                  <span className={styles.metaValue}>{sizeText}</span>
                </div>
              )}

              {rating !== null && reviewCount !== null && (
                <div className={styles.ratingRow} aria-label={`${rating} stars from ${reviewCount} reviews`}>
                  <span className={styles.stars} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}>
                        ★
                      </span>
                    ))}
                  </span>
                  <span className={styles.reviewCount}>{reviewCount}</span>
                </div>
              )}

              {highlights.length > 0 && (
                <ul className={styles.highlights}>
                  {highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}

              {extras.shortDescription && (
                <p className={styles.description}>{extras.shortDescription}</p>
              )}

              {!extras.shortDescription && product.description && (
                <p className={styles.description}>{product.description}</p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className={styles.variants}>
                <label className={styles.label}>Select {product.variants[0].name}:</label>
                <div className={styles.variantOptions}>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`${styles.variantBtn} ${selectedVariant === variant.id ? styles.active : ''}`}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart + favorites */}
            <div className={styles.actions}>
              <div className={styles.quantity}>
                <label className={styles.label} htmlFor="qty">
                  Qty
                </label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className={styles.quantityInput}
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={styles.addToCartHeart}
                aria-label="Add to cart"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.heartIcon}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className={styles.addToCartText}>Add</span>
              </button>

              <button
                type="button"
                className={`${styles.favoriteHeart} ${isFavorite ? styles.favoriteActive : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                onClick={() => setIsFavorite((v) => !v)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.heartIconSmall}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

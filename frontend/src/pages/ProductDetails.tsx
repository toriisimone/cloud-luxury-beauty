import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import * as productsApi from '../api/productsApi';
import ProductCard from '../components/ProductCard';
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [useItWithProducts, setUseItWithProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState<Product[]>([]);
  const [zipCode] = useState('46220');

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

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category?.slug) return;
      setRelatedLoading(true);
      try {
        // 1) Featured Products (site-wide)
        const featuredRes = await productsApi.getProducts({
          featured: true,
          page: 1,
          limit: 16,
        });
        setFeaturedProducts((featuredRes.products || []).slice(0, 12));

        // 2) Category pool
        const catRes = await productsApi.getProducts({
          category: product.category.slug,
          page: 1,
          limit: 60,
        });
        const pool = (catRes.products || []).filter((p) => p.id !== product.id);

        // Use It With (small)
        setUseItWithProducts(pool.slice(0, 6));

        // Similar Products (bigger)
        setSimilarProducts(pool.slice(0, 12));

        // You May Also Like (grid) — same as earlier relatedProducts behavior
        setRelatedProducts(pool.slice(0, 12));

        // Optional: cross-category picks for variety
        const allCore = ['skincare', 'makeup', 'hair', 'fragrance', 'body'] as const;
        const otherCats = allCore.filter((c) => c !== product.category?.slug);
        const otherRes = await Promise.all(
          otherCats.map((c) =>
            productsApi.getProducts({
              category: c,
              page: 1,
              limit: 6,
            })
          )
        );
        const buckets = otherRes.map((r) => r.products || []);
        const interleaved: Product[] = [];
        let idx = 0;
        while (interleaved.length < 12) {
          let added = false;
          for (const b of buckets) {
            if (b[idx]) {
              interleaved.push(b[idx]);
              added = true;
              if (interleaved.length >= 12) break;
            }
          }
          if (!added) break;
          idx++;
        }
        setYouMayAlsoLikeProducts(interleaved.filter((p) => p.id !== product.id).slice(0, 12));
      } catch (e) {
        console.error('[ProductDetails] Failed to load related products:', e);
        setRelatedProducts([]);
        setFeaturedProducts([]);
        setUseItWithProducts([]);
        setSimilarProducts([]);
        setYouMayAlsoLikeProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [product?.category?.slug, product?.id]);

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

  // IMPORTANT: Do not use hooks (useMemo) down here; this component has early returns above.
  // Compute size text safely without hooks to avoid React hook-order crashes in production.
  const sizeText = (() => {
    const v = product.variants?.find((vv) => vv.id === selectedVariant);
    if (!v) return null;
    const isSize = v.name?.toLowerCase() === 'size';
    return isSize ? v.value : null;
  })();

  const extras = product as unknown as {
    rating?: number;
    reviewCount?: number;
    highlights?: string[];
    shortDescription?: string;
  };

  const highlights = Array.isArray(extras.highlights) ? extras.highlights.filter(Boolean) : [];
  const rating =
    typeof extras.rating === 'number'
      ? extras.rating
      : (() => {
          // Default rating to keep PDP structure consistent across all products
          const seed = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
          return 4 + (seed % 10) / 10;
        })();
  const reviewCount =
    typeof extras.reviewCount === 'number'
      ? extras.reviewCount
      : (() => {
          const seed = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
          return 50 + (seed % 950);
        })();
  const favoritesCount = (() => {
    const seed = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `${((seed % 98000) / 1000 + 1).toFixed(1)}K`;
  })();
  const payments = (price / 4).toFixed(2);
  const autoReplenishPrice = (price * 0.95).toFixed(2);
  const deliveryDateLabel = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  })();

  const toTitleCase = (input: string): string => {
    const smallWords = new Set(['to', 'and', 'or', 'the', 'a', 'an', 'of', 'in', 'on', 'for', 'with', 'at', 'by']);
    return input
      .split(' ')
      .filter(Boolean)
      .map((word, idx) => {
        const lower = word.toLowerCase();
        if (idx !== 0 && smallWords.has(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  };

  const deriveBrandTitle = (p: Product): { brand: string | null; title: string } => {
    const desc = (p.description || '').trim();
    const name = (p.name || '').trim();

    // Seed pattern: name = "Brand - Full Title", description = "Full Title"
    if (desc && name && name.toLowerCase().includes(desc.toLowerCase())) {
      const idx = name.toLowerCase().indexOf(desc.toLowerCase());
      const before = name.slice(0, idx).replace(/[-–—]+$/g, '').trim();
      return { brand: before || null, title: desc };
    }

    // Fallback: use full name as title
    return { brand: null, title: name };
  };

  const { brand, title } = deriveBrandTitle(product);

  return (
    <div className={styles.details}>
      <div className={styles.container}>
        {/* Breadcrumbs (Sephora-style structure) */}
        <div className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          {product.category?.slug ? (
            <Link to={`/category/${product.category.slug}`} className={styles.breadcrumbLink}>
              {toTitleCase(product.category.name || product.category.slug)}
            </Link>
          ) : (
            <span className={styles.breadcrumbCurrent}>Products</span>
          )}
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{toTitleCase(title)}</span>
        </div>

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
            {brand && <div className={styles.brand}>{toTitleCase(brand)}</div>}
            <h1 className={styles.title}>{toTitleCase(title)}</h1>

            <div className={styles.topRatingRow} aria-label={`${rating} stars from ${reviewCount} reviews`}>
              <span className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}>
                    ★
                  </span>
                ))}
              </span>
              <span className={styles.reviewCount}>{reviewCount}</span>
              <span className={styles.dotSep}>|</span>
              <button type="button" className={styles.askQuestionBtn}>
                Ask a Question
              </button>
              <span className={styles.dotSep}>|</span>
              <span className={styles.favCount} aria-label={`${favoritesCount} favorites`}>
                <span className={styles.favHeart} aria-hidden="true">
                  ♥
                </span>
                <span>{favoritesCount}</span>
              </span>
            </div>

            {/* Clean info block (no fulfillment/shipping UI) */}
            <div className={styles.infoBlock}>
              <div className={styles.priceRow}>
                <div className={styles.price}>${price.toFixed(2)}</div>
              </div>

              <div className={styles.paymentsRow}>
                <span>or 4 payments of </span>
                <b>${payments}</b>
                <span> with </span>
                <span className={styles.paymentsBrand}>Klarna</span>
                <span className={styles.paymentsBrand}>Afterpay</span>
                <span className={styles.paymentsBrand}>PayPal</span>
              </div>

              <div className={styles.autoReplenishRow}>
                Get It For <b>${autoReplenishPrice}</b> (5% Off) With Auto‑Replenish
              </div>

              {sizeText && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Size:</span>
                  <span className={styles.metaValue}>{sizeText}</span>
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

            {/* Sephora-style fulfillment/service section */}
            <div className={styles.fulfillmentSection} aria-label="Delivery and services">
              <div className={styles.serviceBoxes}>
                <div className={styles.serviceBox}>
                  <div className={styles.serviceTitle}>
                    <a className={styles.serviceLink} href="/account">
                      Sign in
                    </a>{' '}
                    for <b>FREE</b> shipping
                  </div>
                  <div className={styles.serviceSub}>Delivery by {deliveryDateLabel} to {zipCode}</div>
                </div>
                <div className={styles.serviceBox}>
                  <div className={styles.serviceTitle}>Auto‑Replenish</div>
                  <div className={styles.serviceSub}>Save 5% on this item</div>
                </div>
                <div className={styles.serviceBox}>
                  <div className={styles.serviceTitle}>Same‑Day Delivery</div>
                  <div className={styles.serviceSub}>{zipCode}</div>
                </div>
                <div className={styles.serviceBox}>
                  <div className={styles.serviceTitle}>Buy Online &amp; Pick Up</div>
                  <div className={styles.serviceSub}>GLENDALE TOWN CENTER</div>
                </div>
              </div>

              <div className={styles.deliveryBlock}>
                <div className={styles.deliveryLine}>
                  <b>Delivery by {deliveryDateLabel}</b> to {zipCode}
                </div>
                <div className={styles.deliverySub}>
                  <a className={styles.serviceLink} href="/account">
                    Sign in
                  </a>{' '}
                  or create an account to enjoy <b>FREE</b> standard shipping.
                </div>
                <a className={styles.serviceLink} href="/shipping-returns">
                  Shipping &amp; Returns
                </a>
              </div>
            </div>

            {/* Add to cart + favorites */}
            <div className={styles.actions}>
              <div className={styles.qtyBlock}>
                <div className={styles.qtyLabel}>Qty</div>
                <div className={styles.actionRow}>
                  {/* Sephora-style CTA group: qty control + pill button (hot pink) */}
                  <div className={styles.ctaGroup}>
                    <div className={styles.qtyStepper} aria-label="Quantity selector">
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <input
                        id="qty"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                        className={styles.quantityInput}
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button type="button" onClick={handleAddToCart} className={styles.addToCartButton}>
                      Add to Cart
                    </button>
                  </div>

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
              </div>
            </div>
          </section>
        </div>

        {/* You Might Also Like */}
        <section className={styles.relatedSection} aria-label="Product recommendations">
          {featuredProducts.length > 0 && (
            <div className={styles.sectionPanel}>
              <div className={styles.panelHeaderRow}>
                <div className={`${styles.sectionTitle} ${styles.aurapopTitle}`}>{toTitleCase('Featured Products')}</div>
                <div className={styles.panelSubtitle}>Sponsored</div>
              </div>
              <div className={`${styles.cardsRow} ${styles.cardsRowWide}`}>
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {useItWithProducts.length > 0 && (
            <div className={styles.sectionPanel}>
              <div className={styles.panelHeaderRow}>
                <div className={`${styles.sectionTitle} ${styles.aurapopTitle}`}>{toTitleCase('Use It With')}</div>
              </div>
              <div className={`${styles.cardsRow} ${styles.cardsRowCompact}`}>
                {useItWithProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {similarProducts.length > 0 && (
            <div className={styles.sectionPanel}>
              <div className={styles.panelHeaderRow}>
                <div className={`${styles.sectionTitle} ${styles.aurapopTitle}`}>{toTitleCase('Similar Products')}</div>
              </div>
              <div className={styles.cardsRow}>
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          <div className={styles.sectionPanel}>
            <div className={styles.panelHeaderRow}>
              <div className={`${styles.sectionTitle} ${styles.aurapopTitle}`}>{toTitleCase('You May Also Like')}</div>
            </div>
            {relatedLoading ? (
              <div className={styles.relatedLoading}>Loading...</div>
            ) : (
              <div className={styles.cardsRow}>
                {(youMayAlsoLikeProducts.length > 0 ? youMayAlsoLikeProducts : relatedProducts).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;

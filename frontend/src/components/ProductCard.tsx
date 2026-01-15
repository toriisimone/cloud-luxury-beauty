import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCartDrawer } from '../context/CartDrawerContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'search';
}

const ProductCard = ({ product, variant = 'default' }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const cartDrawer = useCartDrawer();
  const isFavorite = isInWishlist(product.id);

  // Consistent demo rating per product (until you wire real review data)
  const { rating, reviewCount } = useMemo(() => {
    const seed = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const r = (4.0 + (seed % 10) / 10);
    const count = 50 + (seed % 500);
    return {
      rating: r.toFixed(1),
      reviewCount: count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString(),
    };
  }, [product.id]);

  // Split "Brand Title" into separate lines using the seeded DB pattern:
  // - product.name is "Brand Title"
  // - product.description is the Title
  const { brand, title } = useMemo(() => {
    const desc = (product.description || '').trim();
    const name = (product.name || '').trim();

    if (desc && name && name.endsWith(desc)) {
      const b = name.slice(0, Math.max(0, name.length - desc.length)).trim();
      return { brand: b || name, title: desc };
    }

    return { brand: name, title: desc || name };
  }, [product.description, product.name]);

  return (
    <div className={styles.card} data-variant={variant}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {/* Favorite Heart Button (top-right) */}
          <button
            type="button"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await toggleWishlist(product.id);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {product.images && product.images.length > 0 && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} onError={(e) => {
              e.currentTarget.style.display = 'none';
            }} />
          ) : (
            <div className={styles.placeholder}>Product Image</div>
          )}
          
          {/* Featured/New badge (top-left) */}
          {product.featured && (
            <span className={styles.badge}>NEW</span>
          )}
        </div>
        
        <div className={styles.content}>
          <p className={styles.brand}>{brand}</p>
          <h3 className={styles.name}>{title}</h3>
          
          {/* Rating Row */}
          <div className={styles.rating}>
            <span className={styles.stars}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.floor(parseFloat(rating)) ? styles.starFilled : styles.starEmpty}>
                  ★
                </span>
              ))}
            </span>
            <span className={styles.ratingText}>
              ({reviewCount})
            </span>
          </div>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>

          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.addToCart}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product, undefined, 1);
                cartDrawer.open({ product, quantity: 1 });
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

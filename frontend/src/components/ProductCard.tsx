import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  // Get size options from variants if available
  const sizeVariants = product.variants?.filter(v => v.name.toLowerCase() === 'size') || [];
  const hasSizeOptions = sizeVariants.length > 0;
  
  // Set default selected size if available
  const defaultSize = hasSizeOptions && sizeVariants.length > 0 ? sizeVariants[0].value : null;
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart functionality
    const selectedVariant = selectedSize ? sizeVariants.find(v => v.value === selectedSize) : undefined;
    addItem(product, selectedVariant);
  };

  // Generate random rating for demo (4.0 to 5.0) - consistent per product
  const [rating] = useState(() => (4.0 + Math.random() * 1.0).toFixed(1));
  const [reviewCount] = useState(() => Math.floor(Math.random() * 500) + 50);
  
  // Determine badges - award badge top-left, other badges top-right
  const hasAwardBadge = product.featured || Math.random() > 0.7;
  const otherBadges: string[] = [];
  
  if (product.featured) {
    if (Math.random() > 0.5) {
      otherBadges.push("tori's favorite");
    } else {
      otherBadges.push("best seller");
    }
  }
  
  // Extract short description/tagline from product description
  const description = product.description ? 
    product.description.split(/[.!?]/).filter(s => s.trim().length > 0)[0]?.trim().substring(0, 45) + '...' : 
    null;

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {product.images && product.images.length > 0 && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} onError={(e) => {
              e.currentTarget.style.display = 'none';
            }} />
          ) : (
            <div className={styles.placeholder}>Product Image</div>
          )}
          
          {/* Award badge - top left (circular style like reference) */}
          {hasAwardBadge && (
            <span className={styles.awardBadge}>award winner</span>
          )}
          
          {/* Other badges - top right (rectangular style) */}
          {otherBadges.map((badge, index) => (
            <span key={index} className={styles.badge}>{badge}</span>
          ))}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name.toLowerCase()}</h3>
          
          {/* Description/Tagline */}
          {description && (
            <p className={styles.description}>{description}</p>
          )}
          
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
          
          {/* Price - with optional original price for bundles */}
          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.price < (product.price * 1.15) && Math.random() > 0.7 && (
              <span className={styles.originalPrice}>
                ${(product.price * 1.15).toFixed(0)}
              </span>
            )}
          </div>
          
          {/* Size selector - hidden for now to match Kylie style */}
          {false && hasSizeOptions && (
            <div className={styles.sizeSelector}>
              {sizeVariants.map((variant, index) => (
                <button
                  key={variant.id || index}
                  className={`${styles.sizeOption} ${selectedSize === variant.value ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(variant.value);
                  }}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          )}
        </div>
      </Link>
      
      {/* CTA Button - Full width, outside link */}
      <button onClick={handleAddToCart} className={styles.addToCart}>
        add to cart - ${product.price.toFixed(2)}
      </button>
    </div>
  );
};

export default ProductCard;

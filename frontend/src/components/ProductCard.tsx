import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/global';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Get size options from variants if available
  const sizeVariants = product.variants?.filter(v => v.name.toLowerCase() === 'size') || [];
  const hasSizeOptions = sizeVariants.length > 0;
  
  // Set default selected size if available
  const defaultSize = hasSizeOptions && sizeVariants.length > 0 ? sizeVariants[0].value : null;
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize);

  const handleBuyOnAmazon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Placeholder for Amazon affiliate link integration
    // In production, this would navigate to an Amazon affiliate link
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}`;
    window.open(amazonUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate random rating for demo (4.0 to 5.0)
  const rating = (4.0 + Math.random() * 1.0).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 50;
  
  // Random labels for featured products
  const labels = ['Best-seller', 'Award Winner', 'New'];
  const randomLabel = product.featured ? labels[Math.floor(Math.random() * labels.length)] : null;

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {product.images && product.images.length > 0 && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} onError={(e) => {
              // If image fails to load, hide the broken image element
              e.currentTarget.style.display = 'none';
            }} />
          ) : (
            <div className={styles.placeholder}>Product Image</div>
          )}
          {randomLabel && (
            <span className={styles.label}>{randomLabel}</span>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.category && (
            <p className={styles.category}>{product.category.name}</p>
          )}
          <div className={styles.rating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.floor(parseFloat(rating)))}
              {parseFloat(rating) % 1 >= 0.5 && '☆'}
            </span>
            <span className={styles.ratingText}>
              {rating} ({reviewCount})
            </span>
          </div>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          {hasSizeOptions && (
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
      <button onClick={handleBuyOnAmazon} className={styles.buyOnAmazon}>
        Buy on Amazon
      </button>
    </div>
  );
};

export default ProductCard;

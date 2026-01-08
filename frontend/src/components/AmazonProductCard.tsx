import { useState } from 'react';
import { AmazonProduct } from '../api/amazonApi';
import styles from './ProductCard.module.css';

interface AmazonProductCardProps {
  product: AmazonProduct;
}

const AmazonProductCard = ({ product }: AmazonProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(product.size || null);

  const handleBuyOnAmazon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open Amazon affiliate link in new tab
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Get size options if available
  const sizeOptions = product.size ? [product.size] : [];

  return (
    <div className={styles.card}>
      <div className={styles.link}>
        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
          {product.tags && product.tags.length > 0 && (
            <span className={styles.label}>{product.tags[0]}</span>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.title}</h3>
          {product.rating && product.rating > 0 && (
            <div className={styles.rating}>
              <span className={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 && '☆'}
              </span>
              <span className={styles.ratingText}>
                {product.rating.toFixed(1)} {product.reviewCount ? `(${product.reviewCount})` : ''}
              </span>
            </div>
          )}
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          {sizeOptions.length > 0 && (
            <div className={styles.sizeSelector}>
              {sizeOptions.map((size, index) => (
                <button
                  key={index}
                  className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button onClick={handleBuyOnAmazon} className={styles.buyOnAmazon}>
        Buy on Amazon
      </button>
    </div>
  );
};

export default AmazonProductCard;

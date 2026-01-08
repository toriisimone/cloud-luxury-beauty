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

  // Log image URL and handle errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    console.warn('[AMAZON PRODUCT CARD] Image failed to load:', {
      productTitle: product.title,
      imageUrl: product.imageUrl,
      attemptedSrc: img.src,
    });
    // Hide broken image but keep the card visible
    img.style.display = 'none';
  };

  const handleImageLoad = () => {
    console.log('[AMAZON PRODUCT CARD] Image loaded successfully:', {
      productTitle: product.title,
      imageUrl: product.imageUrl,
    });
  };

  // Simple check: render if imageUrl exists and is not empty
  const hasImageUrl = product.imageUrl && product.imageUrl.trim().length > 0;

  return (
    <div className={styles.card}>
      <div className={styles.link}>
        <div className={styles.imageContainer}>
          {hasImageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className={styles.image}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', backgroundColor: '#f5f5f5' }}>
              <span>No Image</span>
            </div>
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

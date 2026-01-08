import { Link } from 'react-router-dom';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  // Generate random rating for demo (4.0 to 5.0)
  const rating = (4.0 + Math.random() * 1.0).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 50;
  
  // Random labels for featured products
  const labels = ['Best Seller', 'Award Winner', 'Kylie\'s Favorite', 'New'];
  const randomLabel = product.featured ? labels[Math.floor(Math.random() * labels.length)] : null;

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
          {randomLabel && (
            <span className={styles.label}>{randomLabel}</span>
          )}
          {product.featured && !randomLabel && (
            <span className={styles.featured}>Featured</span>
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
        </div>
      </Link>
      <button onClick={handleQuickAdd} className={styles.quickAdd}>
        Quick Add
      </button>
    </div>
  );
};

export default ProductCard;

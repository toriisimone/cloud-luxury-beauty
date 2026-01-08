import { Link } from 'react-router-dom';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  // Get size options from variants if available
  const sizeVariants = product.variants?.filter(v => v.name.toLowerCase() === 'size') || [];
  const hasSizeOptions = sizeVariants.length > 0;

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
          {(product.featured || product.stock < 20) && (
            <span className={styles.badge}>
              {product.featured ? 'Best-seller' : 'Limited Edition'}
            </span>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          {hasSizeOptions && (
            <div className={styles.sizeSelector}>
              {sizeVariants.map((variant, index) => (
                <span key={variant.id || index} className={styles.sizeOption}>
                  {variant.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <button onClick={handleAddToBag} className={styles.addToBag}>
        Add to bag
      </button>
    </div>
  );
};

export default ProductCard;

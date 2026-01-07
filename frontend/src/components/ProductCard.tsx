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

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
          {product.featured && <span className={styles.featured}>Featured</span>}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.category && (
            <p className={styles.category}>{product.category.name}</p>
          )}
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

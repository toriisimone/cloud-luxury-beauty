import { Link } from 'react-router-dom';
import { Category } from '../types/global';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?categoryId=${category.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {category.image ? (
          <img src={category.image} alt={category.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>{category.name}</div>
        )}
        <div className={styles.overlay}>
          <h3 className={styles.name}>{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

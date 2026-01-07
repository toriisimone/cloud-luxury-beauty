import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Category } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Categories.module.css';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.categories}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shop by Category</h1>
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

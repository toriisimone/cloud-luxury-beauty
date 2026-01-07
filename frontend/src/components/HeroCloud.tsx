import { Link } from 'react-router-dom';
import styles from './HeroCloud.module.css';

const HeroCloud = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.clouds}>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
        <div className={styles.cloud}></div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Cloud Luxury Beauty</h1>
        <p className={styles.subtitle}>
          Discover your radiance with our premium collection of beauty essentials
        </p>
        <Link to="/products" className={styles.cta}>
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default HeroCloud;

import styles from './Products.module.css';

const Skincare = () => {
  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skincare</h1>
        </div>
      </div>
    </div>
  );
};

export default Skincare;

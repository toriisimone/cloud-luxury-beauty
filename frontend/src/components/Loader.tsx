import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;

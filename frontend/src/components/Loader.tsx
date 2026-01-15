import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.diamond} aria-hidden="true" />
      <div className={styles.logo} aria-label="AURAPOP">
        AURAPOP
      </div>
      <div className={styles.sub}>Please wait…</div>
    </div>
  );
};

export default Loader;

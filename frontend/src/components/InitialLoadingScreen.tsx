import { useEffect } from 'react';
import styles from './InitialLoadingScreen.module.css';

type Props = {
  onDone: () => void;
  minDurationMs?: number;
};

const InitialLoadingScreen = ({ onDone, minDurationMs = 950 }: Props) => {
  useEffect(() => {
    const start = Date.now();

    const done = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDurationMs - elapsed);
      window.setTimeout(onDone, remaining);
    };

    // If the page is already loaded, finish after minDuration.
    if (document.readyState === 'complete') {
      done();
      return;
    }

    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, [minDurationMs, onDone]);

  return (
    <div className={styles.backdrop} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.inner}>
        <div className={styles.diamond} aria-hidden="true" />
        <div className={styles.logo}>AURAPOP</div>
        <div className={styles.sub}>Loading…</div>
      </div>
    </div>
  );
};

export default InitialLoadingScreen;


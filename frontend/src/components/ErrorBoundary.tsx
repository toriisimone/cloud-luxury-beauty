import React from 'react';
import styles from './ErrorBoundary.module.css';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Keep this log — it’s the only way to see production crashes quickly.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.title}>Something went wrong</div>
            <div className={styles.subtitle}>
              If you just clicked a product, please refresh. If it keeps happening, send me a screenshot of this message.
            </div>
            <pre className={styles.message}>{this.state.message}</pre>
            <button className={styles.button} type="button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


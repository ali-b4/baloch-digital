import styles from './dashboard.module.css';
export default function Loading() { return <main className={styles.main} aria-busy="true"><p className={styles.eyebrow}>Open Compute Inference</p><p role="status">Loading the verified comparison snapshot…</p></main>; }

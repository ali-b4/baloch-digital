'use client';
import styles from './dashboard.module.css';
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className={styles.main}><h1>Comparison unavailable</h1><p>The saved comparison could not be displayed. Please try again.</p><button onClick={reset}>Try again</button></main>; }

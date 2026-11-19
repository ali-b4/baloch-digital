'use client';
import SiteHeader from '../../site-header';
import styles from './dashboard.module.css';
export default function ErrorPage({ retry }: { retry: () => void }) { return <div className="site-shell data-room-page"><SiteHeader location="entry" /><main className={styles.main}><h1>Comparison unavailable</h1><p className={styles.intro}>The saved comparison could not be displayed. Please try again.</p><button className={styles.action} onClick={() => retry()}>Try again</button></main></div>; }

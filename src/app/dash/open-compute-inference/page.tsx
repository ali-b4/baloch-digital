import SiteHeader from '../../site-header';
import RouteTransition from '../../route-transition';
import { dataRoomEntries } from '../../data/entries';
import { entryMetadata } from '../../data/entry-metadata';
import { loadDashboard } from '@/lib/open-compute-store';
import ProtectedEntryGate from '../../data/protected-entry-gate';
import { hasValidDataRoomSession } from '../../data/session';
import Dashboard from './dashboard';
import styles from './dashboard.module.css';
export const metadata = entryMetadata(dataRoomEntries.openCompute);
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export default async function OpenComputePage() {
  if (!(await hasValidDataRoomSession())) return <ProtectedEntryGate entry={dataRoomEntries.openCompute} />;
  const snapshot = await loadDashboard();
  return <RouteTransition><div className="site-shell data-room-page"><a className={styles.skip} href="#comparison">Skip to comparison</a><SiteHeader location="entry" /><main className={styles.main}><Dashboard snapshot={snapshot} /></main></div></RouteTransition>;
}

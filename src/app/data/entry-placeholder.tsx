import type { Metadata } from "next";
import type { DataRoomEntry } from "./entries";
import EntryShell from "./entry-shell";
import ProtectedEntryGate from "./protected-entry-gate";
import { hasValidDataRoomSession } from "./session";

export function entryMetadata(entry: DataRoomEntry): Metadata {
  const title = `${entry.title} // Baloch Digital`;
  const description = `${entry.title} — ${entry.category === "Theses" ? "a Baloch Digital thesis" : "a Baloch Digital dashboard"}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    ...(entry.access === "protected" ? { robots: { index: false, follow: false, nocache: true } } : {}),
  };
}

export function EntryPlaceholder({ entry, unlocked = false }: { entry: DataRoomEntry; unlocked?: boolean }) {
  return (
    <EntryShell entry={entry} unlocked={unlocked}>
      <section className="data-room-placeholder" aria-labelledby="placeholder-title">
        <h2 id="placeholder-title">Coming soon</h2>
        <p>{entry.category === "Dashboards" ? "The dashboard will be available here." : "The thesis will be available here."}</p>
      </section>
    </EntryShell>
  );
}

export default async function ProtectedEntryPlaceholder({ entry }: { entry: DataRoomEntry }) {
  if (!(await hasValidDataRoomSession())) {
    return <ProtectedEntryGate entry={entry} />;
  }

  return <EntryPlaceholder entry={entry} unlocked />;
}

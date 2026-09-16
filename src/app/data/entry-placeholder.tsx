import type { DataRoomEntry } from "./entries";
import EntryShell from "./entry-shell";
import ProtectedEntryGate from "./protected-entry-gate";
import { hasValidDataRoomSession } from "./session";

export default async function EntryPlaceholder({ entry }: { entry: DataRoomEntry }) {
  const protectedEntry = entry.access === "protected";

  if (protectedEntry && !(await hasValidDataRoomSession())) {
    return <ProtectedEntryGate entry={entry} />;
  }

  return (
    <EntryShell entry={entry} unlocked={protectedEntry}>
      <section className="data-room-placeholder" aria-labelledby="placeholder-title">
        <h2 id="placeholder-title">Coming soon</h2>
        <p>{entry.category === "Dashboards" ? "The dashboard will be available here." : "The thesis will be available here."}</p>
      </section>
    </EntryShell>
  );
}

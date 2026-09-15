import DataRoomGate from "./data-room-gate";
import type { DataRoomEntry } from "./entries";
import EntryShell from "./entry-shell";
import { isDataRoomConfigured } from "./session";

export default function ProtectedEntryGate({ entry }: { entry: DataRoomEntry }) {
  return (
    <EntryShell entry={entry}>
      <DataRoomGate available={isDataRoomConfigured()} nextPath={entry.href} />
    </EntryShell>
  );
}

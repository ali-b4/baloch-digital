import { dataRoomEntries, entryMetadata } from "../entries";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.orbio;
export const metadata = entryMetadata(entry);

export default function OrbioThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

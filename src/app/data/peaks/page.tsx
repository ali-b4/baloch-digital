import { dataRoomEntries, entryMetadata } from "../entries";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.peaks;
export const metadata = entryMetadata(entry);

export default function PeaksThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

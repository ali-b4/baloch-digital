import { dataRoomEntries, entryMetadata } from "../entries";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.hype;
export const metadata = entryMetadata(entry);

export default function HypeThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

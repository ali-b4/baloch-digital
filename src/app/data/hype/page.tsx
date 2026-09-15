import { dataRoomEntries } from "../entries";
import ProtectedEntryPlaceholder, { entryMetadata } from "../entry-placeholder";

const entry = dataRoomEntries.hype;
export const metadata = entryMetadata(entry);

export default function HypeThesisPage() {
  return <ProtectedEntryPlaceholder entry={entry} />;
}

import { dataRoomEntries } from "../entries";
import ProtectedEntryPlaceholder, { entryMetadata } from "../entry-placeholder";

const entry = dataRoomEntries.meta;
export const metadata = entryMetadata(entry);

export default function MetaThesisPage() {
  return <ProtectedEntryPlaceholder entry={entry} />;
}

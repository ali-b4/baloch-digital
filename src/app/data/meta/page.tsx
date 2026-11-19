import { dataRoomEntries } from "../entries";
import { entryMetadata } from "../entry-metadata";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.meta;
export const metadata = entryMetadata(entry);

export default function MetaThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

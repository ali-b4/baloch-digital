import { dataRoomEntries } from "../entries";
import { entryMetadata } from "../entry-metadata";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.prl;
export const metadata = entryMetadata(entry);

export default function PrlThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

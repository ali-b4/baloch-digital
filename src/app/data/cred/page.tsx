import { dataRoomEntries, entryMetadata } from "../entries";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.cred;
export const metadata = entryMetadata(entry);

export default function CredThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

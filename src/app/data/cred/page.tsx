import { dataRoomEntries } from "../entries";
import { entryMetadata } from "../entry-metadata";
import EntryPlaceholder from "../entry-placeholder";

const entry = dataRoomEntries.cred;
export const metadata = entryMetadata(entry);

export default function CredThesisPage() {
  return <EntryPlaceholder entry={entry} />;
}

import { dataRoomEntries } from "../entries";
import ProtectedEntryPlaceholder, { entryMetadata } from "../entry-placeholder";

const entry = dataRoomEntries.cred;
export const metadata = entryMetadata(entry);

export default function CredThesisPage() {
  return <ProtectedEntryPlaceholder entry={entry} />;
}

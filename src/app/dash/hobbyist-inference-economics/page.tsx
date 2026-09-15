import { dataRoomEntries } from "../../data/entries";
import ProtectedEntryPlaceholder, { entryMetadata } from "../../data/entry-placeholder";

const entry = dataRoomEntries.hobbyist;
export const metadata = entryMetadata(entry);

export default function HobbyistInferenceEconomicsPage() {
  return <ProtectedEntryPlaceholder entry={entry} />;
}

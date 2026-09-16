import { dataRoomEntries, entryMetadata } from "../../data/entries";
import EntryPlaceholder from "../../data/entry-placeholder";

const entry = dataRoomEntries.hobbyist;
export const metadata = entryMetadata(entry);

export default function HobbyistInferenceEconomicsPage() {
  return <EntryPlaceholder entry={entry} />;
}

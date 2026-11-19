import { dataRoomEntries } from "../../data/entries";
import { entryMetadata } from "../../data/entry-metadata";
import EntryPlaceholder from "../../data/entry-placeholder";

const entry = dataRoomEntries.hobbyist;
export const metadata = entryMetadata(entry);

export default function HobbyistInferenceEconomicsPage() {
  return <EntryPlaceholder entry={entry} />;
}

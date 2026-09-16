import { dataRoomEntries, entryMetadata } from "../../data/entries";
import EntryPlaceholder from "../../data/entry-placeholder";

const entry = dataRoomEntries.openCompute;
export const metadata = entryMetadata(entry);

export default function OpenComputeInferencePage() {
  return <EntryPlaceholder entry={entry} />;
}

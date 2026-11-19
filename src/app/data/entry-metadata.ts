import type { Metadata } from "next";
import { openGraphShareImages, twitterShare } from "../share-image";
import type { DataRoomEntry } from "./entries";

export function entryMetadata(entry: DataRoomEntry): Metadata {
  const title = `${entry.title} // Baloch Digital`;
  const description = `${entry.title} — ${entry.category === "Theses" ? "a Baloch Digital thesis" : "a Baloch Digital dashboard"}.`;

  return {
    title,
    description,
    openGraph: { title, description, images: openGraphShareImages },
    twitter: { ...twitterShare, title, description },
    ...(entry.access === "protected"
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
  };
}

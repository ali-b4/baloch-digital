import type { Metadata } from "next";

export type DataRoomEntry = {
  title: string;
  category: "Theses" | "Dashboards";
  href: string;
  access: "protected" | "public";
};

export const dataRoomEntries = {
  nock: { title: "$NOCK", category: "Theses", href: "/data/nock", access: "protected" },
  meta: { title: "$META", category: "Theses", href: "/data/meta", access: "protected" },
  orbio: { title: "$ORBIO", category: "Theses", href: "/data/orbio", access: "protected" },
  hype: { title: "$HYPE", category: "Theses", href: "/data/hype", access: "protected" },
  openCompute: {
    title: "Open Compute Inference",
    category: "Dashboards",
    href: "/dash/open-compute-inference",
    access: "public",
  },
  hobbyist: {
    title: "Hobbyist Inference Economics",
    category: "Dashboards",
    href: "/dash/hobbyist-inference-economics",
    access: "protected",
  },
} as const satisfies Record<string, DataRoomEntry>;

export const dataRoomCategories = ["Dashboards", "Theses"] as const;

export const DATA_ROOM_DEFAULT_DESTINATION = "/data";
const SAFE_URL_ORIGIN = "https://dataroom.invalid";
const allowedPaths = new Set<string>([
  DATA_ROOM_DEFAULT_DESTINATION,
  ...Object.values(dataRoomEntries).map((entry) => entry.href),
]);

export function getSafeDataRoomNextPath(value: unknown) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return DATA_ROOM_DEFAULT_DESTINATION;
  }

  try {
    const url = new URL(value, SAFE_URL_ORIGIN);

    if (url.origin !== SAFE_URL_ORIGIN || !allowedPaths.has(url.pathname)) {
      return DATA_ROOM_DEFAULT_DESTINATION;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DATA_ROOM_DEFAULT_DESTINATION;
  }
}

export function entryMetadata(entry: DataRoomEntry): Metadata {
  const title = `${entry.title} // Baloch Digital`;
  const description = `${entry.title} — ${entry.category === "Theses" ? "a Baloch Digital thesis" : "a Baloch Digital dashboard"}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    ...(entry.access === "protected"
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
  };
}

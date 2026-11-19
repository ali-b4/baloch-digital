export type DataRoomEntry = {
  title: string;
  category: "Theses" | "Dashboards";
  href: string;
  access: "protected" | "public";
};

export const dataRoomEntries = {
  nock: { title: "$NOCK", category: "Theses", href: "/data/nock", access: "protected" },
  meta: { title: "$META", category: "Theses", href: "/data/meta", access: "protected" },
  cred: { title: "$CRED", category: "Theses", href: "/data/cred", access: "protected" },
  prl: { title: "$PRL", category: "Theses", href: "/data/prl", access: "protected" },
  openCompute: {
    title: "Open Compute Inference",
    category: "Dashboards",
    href: "/dash/open-compute-inference",
    access: "protected",
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

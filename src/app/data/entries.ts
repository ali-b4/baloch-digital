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

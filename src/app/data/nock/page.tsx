import type { Metadata } from "next";
import { dataRoomEntries } from "../entries";
import ProtectedEntryGate from "../protected-entry-gate";
import { hasValidDataRoomSession } from "../session";

const gateMetadata: Metadata = {
  title: "Baloch Digital // Data Room",
  description: "Private Baloch Digital Data Room.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  if (!(await hasValidDataRoomSession())) {
    return gateMetadata;
  }

  const { reportAbstract } = await import("./report-copy");

  return {
    title: reportAbstract.title,
    description: "Private Baloch Digital Data Room report.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: "Baloch Digital // Data Room",
      description: "Private Data Room content.",
    },
    twitter: {
      title: "Baloch Digital // Data Room",
      description: "Private Data Room content.",
    },
  };
}

export default async function NockReportPage() {
  if (!(await hasValidDataRoomSession())) {
    return <ProtectedEntryGate entry={dataRoomEntries.nock} />;
  }

  const { default: NockReport } = await import("./report");
  return <NockReport />;
}

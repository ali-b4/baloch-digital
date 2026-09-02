import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DataRoomGate from "./data-room-gate";
import SiteHeader from "../site-header";
import RouteTransition from "../route-transition";
import {
  getSafeDataRoomNextPath,
  hasValidDataRoomSession,
  isDataRoomConfigured,
} from "./session";

export const metadata: Metadata = {
  title: "Data Room // Baloch Digital",
  description: "Private access to the Baloch Digital Data Room.",
  openGraph: {
    title: "Baloch Digital // Data Room",
    description: "Private Data Room access.",
  },
  twitter: {
    title: "Baloch Digital // Data Room",
    description: "Private Data Room access.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type DataRoomPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function DataRoomPage({ searchParams }: DataRoomPageProps) {
  const query = await searchParams;
  const nextPath = getSafeDataRoomNextPath(query.next);
  const authenticated = await hasValidDataRoomSession();

  if (authenticated) {
    redirect(nextPath);
  }

  const available = isDataRoomConfigured();

  return (
    <RouteTransition>
      <div className="site-shell data-room-page">
        <SiteHeader location="data" />

        <main className="data-room-main">
          <section className="data-room-identity" aria-labelledby="data-room-title">
            <div className="data-room-orbit" aria-hidden="true">
              <span />
            </div>
            <h1 id="data-room-title">
              <span>Data</span>
              <span>Room</span>
            </h1>
            <p>Controlled access</p>
          </section>

          <DataRoomGate available={available} nextPath={nextPath} />
        </main>
      </div>
    </RouteTransition>
  );
}

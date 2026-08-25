import type { Metadata } from "next";
import DataRoomGate from "./data-room-gate";
import SiteHeader from "../site-header";
import RouteTransition from "../route-transition";

export const metadata: Metadata = {
  title: "Data Room // Baloch Digital",
  description: "Private access to the Baloch Digital Data Room.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DataRoomPage() {
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

          <DataRoomGate />
        </main>
      </div>
    </RouteTransition>
  );
}

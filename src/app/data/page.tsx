import type { Metadata } from "next";
import Link from "next/link";
import OrbitDiagram from "../orbit-diagram";
import SiteHeader from "../site-header";
import RouteTransition from "../route-transition";
import { lockDataRoom } from "./actions";
import { dataRoomCategories, dataRoomEntries } from "./entries";
import { hasValidDataRoomSession } from "./session";

export const metadata: Metadata = {
  title: "Data Room // Baloch Digital",
  description: "Explore Baloch Digital theses and dashboards.",
  openGraph: {
    title: "Baloch Digital // Data Room",
    description: "Explore Baloch Digital theses and dashboards.",
  },
  twitter: {
    title: "Baloch Digital // Data Room",
    description: "Explore Baloch Digital theses and dashboards.",
  },
};

function EntryIcon({ locked }: { locked: boolean }) {
  return (
    <svg className={`data-room-entry-icon${locked ? "" : " is-arrow"}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {locked ? (
        <>
          <rect x="5" y="10" width="14" height="11" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </>
      ) : (
        <path d="M5 12h14m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

export default async function DataRoomPage() {
  const authenticated = await hasValidDataRoomSession();

  return (
    <RouteTransition>
      <div className="site-shell data-room-page">
        <SiteHeader location="data" />
        <main className="data-room-main">
          <section className="data-room-identity" aria-labelledby="data-room-title">
            <div className="data-room-orbit" aria-hidden="true"><OrbitDiagram /></div>
            <h1 id="data-room-title"><span>Data</span><span>Room</span></h1>
          </section>

          <div className="data-room-directory">
            {dataRoomCategories.map((category) => {
              const entries = Object.values(dataRoomEntries).filter((entry) => entry.category === category);

              return (
              <section className="data-room-category" key={category} aria-labelledby={`category-${category.toLowerCase()}`}>
                <h2>
                  <span id={`category-${category.toLowerCase()}`}>{category}</span>
                  <span className="data-room-category-count" aria-hidden="true">{String(entries.length).padStart(2, "0")}</span>
                </h2>
                <ul>
                  {entries.map((entry) => {
                    const locked = !authenticated;
                    const status = locked ? "Locked" : "Unlocked";

                    return (
                      <li key={entry.href}>
                        <Link href={entry.href} className="data-room-entry-link" prefetch={false} transitionTypes={["nav-forward"]}>
                          <span className="data-room-entry-name">{entry.title}</span>
                          <span className="data-room-entry-access">
                            <span>{status}</span>
                            <EntryIcon locked={locked} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
              );
            })}
            {authenticated ? (
              <form className="data-room-directory-footer" action={lockDataRoom}>
                <button className="data-room-text-action" type="submit">Lock protected pages</button>
              </form>
            ) : null}
          </div>
        </main>
      </div>
    </RouteTransition>
  );
}

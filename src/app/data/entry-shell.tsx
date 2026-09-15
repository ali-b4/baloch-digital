import type { ReactNode } from "react";
import SiteHeader from "../site-header";
import RouteTransition from "../route-transition";
import { lockDataRoom } from "./actions";
import type { DataRoomEntry } from "./entries";

export default function EntryShell({ entry, children, unlocked = false }: {
  entry: DataRoomEntry;
  children: ReactNode;
  unlocked?: boolean;
}) {
  return (
    <RouteTransition>
      <div className="site-shell data-room-page">
        <SiteHeader location="entry" />
        <main className="data-room-entry-main">
          <header className="data-room-entry-heading">
            <h1>{entry.title}</h1>
            <p>{entry.category}{" // "}{entry.access === "public" ? "Public" : unlocked ? "Unlocked" : "Locked"}</p>
          </header>
          <div className="data-room-entry-body">{children}</div>
          {unlocked ? (
            <form action={lockDataRoom}><button className="data-room-text-action" type="submit">Lock protected pages</button></form>
          ) : null}
        </main>
      </div>
    </RouteTransition>
  );
}

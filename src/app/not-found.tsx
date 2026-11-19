import type { Metadata } from "next";
import Link from "next/link";
import OrbitDiagram from "./orbit-diagram";
import SiteHeader from "./site-header";

export const metadata: Metadata = {
  title: "Not found // Baloch Digital",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="site-shell data-room-page">
      <SiteHeader location="data" />
      <div className="data-room-entry-orbit" aria-hidden="true">
        <OrbitDiagram state="sealed" />
      </div>
      <main className="data-room-entry-main">
        <header className="data-room-entry-heading">
          <h1>404</h1>
          <p>Page // Not found</p>
        </header>
        <div className="data-room-entry-body">
          <section className="data-room-placeholder" aria-labelledby="not-found-title">
            <h2 id="not-found-title">Nothing at this address</h2>
            <p>
              The page may have moved, or the link may be incorrect. Return{" "}
              <Link href="/">home</Link> or open the{" "}
              <Link href="/data">Data Room</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

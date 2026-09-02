import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const linkPreviewDescription =
  "A hybrid venture and long/short fund built on first-principles thinking and agentic leverage.";

export const metadata: Metadata = {
  title: "// Frontier Venture",
  description: linkPreviewDescription,
  openGraph: {
    description: linkPreviewDescription,
  },
  twitter: {
    description: linkPreviewDescription,
  },
};

const directionContract = `<!--
THESIS: Baloch Digital reads as a calibrated frontier instrument, refusing the familiar fund template of cards, portraits, and borrowed proof.
OWN-WORLD: Warm-cream field, graphite monospaced scale, pale sage-green guidance, sage-ink live markers, hairline measurement grid, and orbital vector geometry.
STORY: The visitor enters through the firm identity, scans three strategy frames, then reaches a direct contact rail.
FIRST VIEWPORT: A full-height stage centers a stacked BALOCH DIGITAL wordmark at monumental scale, with a sage-ink protocol line, clean concentric sage orbital core, rotating geometry crossing the field, system readouts at the margins, and contact fixed to the floor.
FORM: Viewport-scale technical instrument panel, pinned by the supplied Variant export; seed ff432ba9. Signature motion is the slow orbital rotation, staged strategy reveals, and the contact rail docking at the page close.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={spaceMono.variable} data-scroll-behavior="smooth">
      <body>
        <span
          className="direction-contract"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: directionContract }}
        />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import SiteFooter from "./site-footer";
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
  title: "// Frontier",
  description: linkPreviewDescription,
  openGraph: {
    description: linkPreviewDescription,
  },
  twitter: {
    description: linkPreviewDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={spaceMono.variable} data-scroll-behavior="smooth">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

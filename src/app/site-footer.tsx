"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const updateFooter = () => {
      const root = document.documentElement;
      const atEnd =
        isHome && window.scrollY + window.innerHeight >= root.scrollHeight - 60;
      setIsClosing((current) => (current === atEnd ? current : atEnd));
    };

    updateFooter();
    if (!isHome) return;

    window.addEventListener("scroll", updateFooter, { passive: true });
    window.addEventListener("resize", updateFooter);

    return () => {
      window.removeEventListener("scroll", updateFooter);
      window.removeEventListener("resize", updateFooter);
    };
  }, [isHome]);

  return (
    <footer
      className={`site-footer${isHome && isClosing ? " is-closing" : ""}`}
      style={{ viewTransitionName: "site-footer" }}
    >
      <div className="footer-contact">
        <span className="footer-label">GET IN TOUCH</span>
        <a
          href="https://x.com/0xaioli"
          target="_blank"
          rel="noreferrer"
          className="social-link"
          aria-label="Ali on X"
        >
          <XIcon />
        </a>
        <a
          href="mailto:ali@balochdigital.io"
          className="social-link"
          aria-label="Email Baloch Digital"
        >
          <MailIcon />
        </a>
      </div>
    </footer>
  );
}

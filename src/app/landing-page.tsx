"use client";

import { useEffect, useState } from "react";
import InteractiveStarburst from "./interactive-starburst";
import SiteHeader from "./site-header";

const strategies = [
  {
    number: "01",
    system: "GENESIS VECTOR",
    status: "DEPLOYING",
    title: ["Venture", "Activism"],
    description:
      "We identify promising early-stage ventures, invest across private and open markets, and actively support their growth, product, and distribution.",
    delay: "delay-two",
  },
  {
    number: "02",
    system: "MARKET TOPOLOGY",
    status: "ACTIVE",
    title: ["Directional", "Asymmetry"],
    description:
      "We use long/short strategies to hedge broad market risk and capture relative mispricings across assets.",
    delay: "delay-three",
  },
  {
    number: "03",
    system: "NEURAL ALLOCATION",
    status: "OPTIMIZED",
    title: ["Capital /", "Cognition", "Synthesis"],
    description:
      "We use agentic systems to expand our research surface area, augment decision-making, and operate with greater speed and depth.",
    delay: "",
  },
];

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

export default function LandingPage() {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((element) => revealObserver.observe(element));

    const updateFooter = () => {
      const root = document.documentElement;
      const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 60;
      setIsClosing((current) => (current === atEnd ? current : atEnd));
    };

    updateFooter();
    window.addEventListener("scroll", updateFooter, { passive: true });
    window.addEventListener("resize", updateFooter);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateFooter);
      window.removeEventListener("resize", updateFooter);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return (
    <div className="site-shell">
      <SiteHeader location="home" />

      <main className="scroller">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-geometry" aria-hidden="true">
            <div className="hero-geometry-reveal" data-reveal>
              <InteractiveStarburst />
            </div>
          </div>

          <div className="hero-title-wrapper delay-one" data-reveal>
            <h1 id="hero-title">
              <span>BALOCH</span>
              <span>DIGITAL</span>
            </h1>
            <p className="hero-subtitle">Venture // Long/Short</p>
          </div>
        </section>

        <section className="strategies" aria-label="Investment strategies">
          <div className="structural-line" aria-hidden="true" />
          {strategies.map((strategy) => (
            <article
              className={`strategy-block ${strategy.delay}`}
              data-reveal
              key={strategy.number}
            >
              <div className="strategy-meta">
                <span>STRATEGY // {strategy.number}</span>
                <span>{strategy.system}</span>
                <span>STATUS: {strategy.status}</span>
              </div>
              <h2 className="strategy-title">
                {strategy.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="strategy-desc">{strategy.description}</p>
            </article>
          ))}
          <div className="closing-space" aria-hidden="true" />
        </section>
      </main>

      <footer className={`site-footer${isClosing ? " is-closing" : ""}`}>
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
    </div>
  );
}

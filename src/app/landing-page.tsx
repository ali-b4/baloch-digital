"use client";

import { useEffect } from "react";
import InteractiveStarburst from "./interactive-starburst";
import SiteHeader from "./site-header";

const strategies = [
  {
    number: "01",
    title: ["Venture", "Activism"],
    description:
      "We identify promising early-stage ventures, invest across private and open markets, and actively support their growth, product, and distribution.",
    delay: "delay-two",
  },
  {
    number: "02",
    title: ["Directional", "Asymmetry"],
    description:
      "We use long/short strategies to hedge broad market risk and capture relative mispricings across assets.",
    delay: "delay-three",
  },
  {
    number: "03",
    title: ["Capital", "Synthesis"],
    description:
      "We use agentic systems to expand our research surface area, augment decision-making, and operate with greater speed and depth.",
    delay: "",
  },
];

export default function LandingPage() {
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

    return () => {
      revealObserver.disconnect();
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
            <p className="hero-subtitle">VENTURE // RESEARCH</p>
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
                <span>MANDATE // {strategy.number}</span>
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

    </div>
  );
}

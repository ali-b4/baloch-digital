"use client";

import type { CSSProperties, ReactNode } from "react";
import { Component, useEffect, useRef, useState } from "react";
import { lockDataRoom } from "../actions";
import ReportChart from "./report-chart";
import styles from "./report.module.css";
import { clampUnit, resolveReportViewState } from "./report-state";
import type {
  MetricDefinition,
  NarrativeSection,
  ReportCue,
  ReportPoint,
  ReportViewState,
} from "./report-types";

type ReportExperienceProps = {
  children: ReactNode;
  closingContent: ReactNode;
  identityLabel: string;
  reportLabel: string;
  chartIdPrefix: string;
  primaryMetricKey: MetricDefinition["key"];
  metrics: readonly MetricDefinition[];
  points: readonly ReportPoint[];
  cues: readonly ReportCue[];
  sections: readonly Pick<NarrativeSection, "id" | "navigationLabel" | "chapterIndex">[];
};

type ProgressStyle = CSSProperties & { "--report-progress": number };

class ChartErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section className={styles.chartFailure} role="status">
          <span>Visualization // Static fallback</span>
          <p>
            The interactive model could not initialize. Continue through the complete
            article, closing figure, and accessible data table.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}

function shouldCommitView(previous: ReportViewState, next: ReportViewState) {
  if (
    previous.cueId !== next.cueId ||
    previous.activeMetric !== next.activeMetric ||
    previous.activatedMetrics.join(" ") !== next.activatedMetrics.join(" ") ||
    Math.abs(previous.domainMax - next.domainMax) > 0.08
  ) {
    return true;
  }

  return Object.keys(next.reveal).some((key) => {
    const metric = key as keyof ReportViewState["reveal"];
    return Math.abs(previous.reveal[metric] - next.reveal[metric]) > 0.002;
  });
}

export default function ReportExperience({
  children,
  closingContent,
  identityLabel,
  reportLabel,
  chartIdPrefix,
  primaryMetricKey,
  metrics,
  points,
  cues,
  sections,
}: ReportExperienceProps) {
  const [viewState, setViewState] = useState(() =>
    resolveReportViewState(cues, 0, 1, false),
  );
  const [documentProgress, setDocumentProgress] = useState(0);
  const viewStateRef = useRef(viewState);
  const progressPercentRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const cueElements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-report-cue]"),
      );

      if (!cueElements.length) {
        return;
      }

      const headerHeight =
        document
          .querySelector<HTMLElement>("[data-report-header]")
          ?.getBoundingClientRect().height ?? 56;
      const activationLine =
        headerHeight + Math.max(80, (window.innerHeight - headerHeight) * 0.44);
      let activeElement = cueElements[0];
      let activeElementIndex = 0;

      for (const [index, element] of cueElements.entries()) {
        const bounds = element.getBoundingClientRect();
        if (bounds.top <= activationLine) {
          activeElement = element;
          activeElementIndex = index;
        } else {
          break;
        }
      }

      const cueId = activeElement.dataset.reportCue ?? cues[0].id;
      const cueIndex = Math.max(
        0,
        cues.findIndex((cue) => cue.id === cueId),
      );
      const bounds = activeElement.getBoundingClientRect();
      const nextBounds = cueElements[activeElementIndex + 1]?.getBoundingClientRect();
      const cueSpan = nextBounds
        ? nextBounds.top - bounds.top
        : Math.max(bounds.height, window.innerHeight * 0.45);
      const hashTarget = window.location.hash.slice(1);
      const cueProgress =
        activeElement.id && activeElement.id === hashTarget
          ? 1
          : clampUnit(
              (activationLine - bounds.top) /
                Math.max(cueSpan, window.innerHeight * 0.2),
            );
      const nextView = resolveReportViewState(
        cues,
        cueIndex,
        cueProgress,
        motionQuery.matches,
      );

      if (shouldCommitView(viewStateRef.current, nextView)) {
        viewStateRef.current = nextView;
        setViewState(nextView);
      }

      const scrollRange = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const nextProgress = clampUnit(window.scrollY / scrollRange);
      const nextPercent = Math.round(nextProgress * 100);

      if (nextPercent !== progressPercentRef.current) {
        progressPercentRef.current = nextPercent;
        setDocumentProgress(nextProgress);
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motionQuery.addEventListener("change", schedule);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motionQuery.removeEventListener("change", schedule);
    };
  }, [cues]);

  const currentProgress = viewState.chapterIndex === 0 ? "00 / 04" : `${String(viewState.chapterIndex).padStart(2, "0")} / 04`;
  const compactChapter = viewState.chapterLabel.replace(" / Endgame", "");
  const progressStyle: ProgressStyle = {
    "--report-progress": documentProgress,
  };

  return (
    <div className={`site-shell ${styles.shell}`}>
      <a className={styles.skipLink} href="#report-body">
        Skip to report
      </a>

      <header
        className={styles.reportHeader}
        data-report-header
        style={{ viewTransitionName: "site-header" }}
      >
        <div className={styles.headerInner}>
          <a className={styles.identity} href="#report-cover" aria-label="Return to report cover">
            <span>{identityLabel}</span>
            <span aria-hidden="true">{" // "}</span>
            <span className={styles.reportType}>{reportLabel}</span>
          </a>

          <nav className={styles.reportNav} aria-label="Report sections">
            {sections.map((section) => (
              <a
                href={`#${section.id}`}
                className={viewState.sectionId === section.id ? styles.active : undefined}
                aria-current={viewState.sectionId === section.id ? "location" : undefined}
                key={section.id}
              >
                {section.navigationLabel}
              </a>
            ))}
          </nav>

          <div className={styles.headerState}>
            <span className={styles.currentChapter}>
              <span className={styles.chapterLabel}>{viewState.chapterLabel}</span>
              <span className={styles.chapterLabelCompact}>{compactChapter}</span>
              <span aria-hidden="true">{" // "}</span>
              <span className={styles.chapterProgress}>{currentProgress}</span>
            </span>
            <form action={lockDataRoom}>
              <button type="submit">Lock // Data Room</button>
            </form>
          </div>
        </div>
        <span className={styles.documentProgress} style={progressStyle} aria-hidden="true" />
      </header>

      <p className={styles.stageAnnouncement} aria-live="polite" aria-atomic="true">
        Current chapter: {viewState.chapterLabel}
      </p>

      <main className={styles.reportMain}>
        <article id="report-body" className={styles.article} tabIndex={-1}>
          <div className={styles.reportLayout}>
            <div className={styles.narrativeColumn}>{children}</div>

            <aside className={styles.visualColumn} aria-label="Scroll-controlled thesis model">
              <ChartErrorBoundary>
                <ReportChart
                  idPrefix={chartIdPrefix}
                  primaryMetricKey={primaryMetricKey}
                  enableStageInspection
                  metrics={metrics}
                  points={points}
                  viewState={viewState}
                />
              </ChartErrorBoundary>
            </aside>
          </div>
          <div className={styles.closePlane}>{closingContent}</div>
        </article>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RouteTransition from "../../route-transition";
import { hasValidDataRoomSession } from "../session";
import { formatMetricValue } from "./report-format";
import ReportChart from "./report-chart";
import { reportAbstract } from "./report-copy";
import ReportExperience from "./report-experience";
import styles from "./report.module.css";
import { resolveReportViewState } from "./report-state";
import {
  narrativeSections,
  reportClosingSections,
  reportMetadata,
} from "./report-content";
import {
  metricDefinitions,
  reportCues,
  reportPoints,
  reportSources,
} from "./report-data";
import { reportValidation } from "./report-validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const privateMetadata: Metadata = {
  title: reportAbstract.title,
  description: "Private Baloch Digital Data Room report.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "Baloch Digital // Data Room",
    description: "Private Data Room content.",
  },
  twitter: {
    title: "Baloch Digital // Data Room",
    description: "Private Data Room content.",
  },
};

const gateMetadata: Metadata = {
  title: "Baloch Digital // Data Room",
  description: "Private Baloch Digital Data Room.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return (await hasValidDataRoomSession()) ? privateMetadata : gateMetadata;
}

const chartContract = {
  primaryMetricKey: "tokenValue",
} as const;

const dataStatusLabel = reportValidation.publicationReady
  ? "Owner-approved report data."
  : "Format preview // placeholder copy and model data.";

function sourceLabels(sourceIds: readonly string[] | undefined) {
  return (sourceIds ?? []).map(
    (sourceId) =>
      reportSources.find((source) => source.id === sourceId)?.label ??
      `[UNRESOLVED SOURCE // ${sourceId}]`,
  );
}

const protectedDirectionContract = `<!--
NOCK REPORT CONTRACT
THESIS: The report makes a staged valuation argument legible as one scroll-calibrated model, refusing both the dashboard and the conventional article hero.
OWN-WORLD: The warm-cream instrument plane extends into graphite editorial type, sage-ruled data tables, and one sage primary trace with pale sage-green live markers above patterned telemetry tracks.
STORY: The reader calibrates the model, learns its variables, advances through three thesis stages, then inspects risks, methodology, sources, and the underlying values.
FIRST VIEWPORT: Beneath the report housing, the report title and editorial abstract face a seed-state plot; placeholder status, stage position, and lock access remain visible.
FORM: Chaptered scrollytelling research instrument specified by PRD-nock-interactive-report; seed nock-prd-20260831. Signature motion is reversible line growth, scale calibration, one-at-a-time auxiliary activation, and a temporary primary-path crossfade into the stage summary.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

function ReportCover() {
  const coverViewState = resolveReportViewState(reportCues, 0, 1, true);

  return (
    <section
      id="report-cover"
      className={styles.cover}
      data-report-cue="cover-calibration"
      aria-labelledby="nock-report-title"
    >
      <div className={styles.coverLockup}>
        <h1 id="nock-report-title">{reportAbstract.title}</h1>
        <p className={styles.reportKind}>{reportMetadata.reportType}</p>
      </div>

      <p className={styles.placeholderStatus}>
        <span aria-hidden="true" />
        {dataStatusLabel}
      </p>

      <section
        className={styles.coverAbstract}
        aria-labelledby="nock-report-abstract-title"
      >
        <h2 id="nock-report-abstract-title">{reportAbstract.heading}</h2>
        <p className={styles.abstractDisclaimer}>
          <em>{reportAbstract.disclaimer}</em>
        </p>
        <div className={styles.abstractBody}>
          {reportAbstract.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`abstract-paragraph-${paragraphIndex}`}>
              {paragraph.map((segment, segmentIndex) =>
                segment.emphasis === "strong" ? (
                  <strong key={`abstract-segment-${segmentIndex}`}>
                    {segment.text}
                  </strong>
                ) : (
                  segment.text
                ),
              )}
            </p>
          ))}
        </div>
      </section>

      <div className={styles.scrollCue} aria-hidden="true">
        <span />
        Scroll to calibrate
      </div>

      <div className={styles.stepSnapshot}>
        <ReportChart
          idPrefix="nock-cover-snapshot"
          {...chartContract}
          compact
          metrics={metricDefinitions}
          points={reportPoints}
          viewState={coverViewState}
        />
      </div>
    </section>
  );
}

function Narrative() {
  return narrativeSections.map((section) => (
    <section
      className={styles.narrativeSection}
      id={section.id}
      data-report-cue={section.steps[0]?.cueId}
      aria-labelledby={`${section.id}-title`}
      key={section.id}
    >
      <header className={styles.sectionHeader}>
        <span aria-hidden="true">{String(section.chapterIndex).padStart(2, "0")} / 04</span>
        <h2 id={`${section.id}-title`}>{section.heading}</h2>
        <p>{section.summary}</p>
      </header>

      {section.steps.map((step, stepIndex) => (
        <div
          className={styles.narrativeStep}
          data-report-cue={stepIndex === 0 ? undefined : step.cueId}
          key={step.cueId}
        >
          <h3>{step.heading}</h3>
          {step.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${step.cueId}-paragraph-${paragraphIndex}`}>{paragraph}</p>
          ))}
          {step.note ? <aside className={styles.editorialNote}>{step.note}</aside> : null}
          {step.sourceIds?.length || step.riskIds?.length ? (
            <footer className={styles.stepReferences}>
              {step.sourceIds?.length ? (
                <p>Sources // {sourceLabels(step.sourceIds).join("; ")}</p>
              ) : null}
              {step.riskIds?.length ? (
                <p>Risk references // {sourceLabels(step.riskIds).join("; ")}</p>
              ) : null}
            </footer>
          ) : null}
          <div className={styles.stepSnapshot}>
            <ReportChart
              idPrefix={`nock-snapshot-${step.cueId}`}
              {...chartContract}
              metrics={metricDefinitions}
              points={reportPoints}
              viewState={resolveReportViewState(
                reportCues,
                reportCues.findIndex((cue) => cue.id === step.cueId),
                1,
                true,
              )}
            />
          </div>
        </div>
      ))}
    </section>
  ));
}

function ReportDataTable() {
  return (
    <div
      className={styles.dataTableWrap}
      role="region"
      aria-label="Nock model data"
      tabIndex={0}
    >
      <table>
        <caption>
          Every modeled milestone and metric displayed in the figure.
        </caption>
        <thead>
          <tr>
            <th scope="col">Milestone</th>
            {metricDefinitions.map((metric) => (
              <th scope="col" key={metric.key}>
                {metric.label}
                <span>{metric.unit}</span>
                <span>{sourceLabels(metric.sourceIds).join("; ")}</span>
              </th>
            ))}
            <th scope="col">Status</th>
            <th scope="col">Sources / assumptions</th>
          </tr>
        </thead>
        <tbody>
          {reportPoints.map((point) => (
            <tr key={point.id}>
              <th scope="row">{point.milestone}</th>
              {metricDefinitions.map((metric) => (
                <td key={metric.key}>
                  {formatMetricValue(point[metric.key], metric.formatter)}
                </td>
              ))}
              <td>{point.classification}</td>
              <td>{sourceLabels(point.sourceIds).join("; ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportClose() {
  const finalViewState = resolveReportViewState(
    reportCues,
    reportCues.length - 1,
    1,
    true,
  );

  return (
    <section
      id="methodology"
      className={styles.reportClose}
      data-report-cue="close-complete"
      aria-labelledby="methodology-title"
    >
      <header className={styles.sectionHeader}>
        <span aria-hidden="true">Close // 04 / 04</span>
        <h2 id="methodology-title">Methodology &amp; limits</h2>
        <p>The complete figure holds while the reader inspects how it should eventually be supported.</p>
      </header>

      <div className={styles.closeFigure}>
        <ReportChart
          idPrefix="nock-close-final"
          {...chartContract}
          metrics={metricDefinitions}
          points={reportPoints}
          viewState={finalViewState}
        />
      </div>

      <div className={styles.closeGrid}>
        {reportClosingSections.map((section) => (
          <section key={section.id}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      <ReportDataTable />

      <footer className={styles.publicationGate}>
        <span>
          Publication gate // {reportValidation.publicationReady ? "ready" : "locked"}
        </span>
        <p>
          {reportValidation.warning ??
            "All report data, sources, disclosures, and editorial fields passed validation."}
        </p>
      </footer>
    </section>
  );
}

function NoScriptFallback() {
  return (
    <noscript>
      <style>{`.${styles.visualColumn}{display:none!important}.${styles.narrativeColumn}{padding-top:0!important}`}</style>
    </noscript>
  );
}

export default async function NockReportPage() {
  const authenticated = await hasValidDataRoomSession();

  if (!authenticated) {
    redirect("/data?next=%2Fdata%2Fnock");
  }

  const sections = narrativeSections.map(({ id, navigationLabel, chapterIndex }) => ({
    id,
    navigationLabel,
    chapterIndex,
  }));

  return (
    <RouteTransition>
      <span
        className="direction-contract"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: protectedDirectionContract }}
      />
      <ReportExperience
          identityLabel={reportMetadata.ticker}
          reportLabel={reportMetadata.reportType}
          chartIdPrefix="interactive-report"
          {...chartContract}
          closingContent={
            <>
              <ReportClose />
              <NoScriptFallback />
            </>
          }
          metrics={metricDefinitions}
          points={reportPoints}
          cues={reportCues}
          sections={sections}
        >
          <ReportCover />
          <Narrative />
        </ReportExperience>
    </RouteTransition>
  );
}

import "server-only";

import {
  narrativeSections,
  reportClosingSections,
  reportMetadata,
} from "./report-content";
import {
  metricDefinitions,
  reportAnnotations,
  reportCues,
  reportPoints,
  reportSources,
  reportStages,
} from "./report-data";
import type { MetricKey } from "./report-types";

const requiredMetricKeys: readonly MetricKey[] = [
  "tokenValue",
  "workRate",
  "inferenceRevenue",
  "globalConsumption",
];

function assertUnique(values: readonly string[], label: string) {
  const unique = new Set(values);
  if (unique.size !== values.length) {
    throw new Error(`Duplicate ${label} detected in Nock report data.`);
  }
}

function assertNonEmpty(values: readonly unknown[], label: string) {
  if (!values.length) {
    throw new Error(`Nock report requires at least one ${label}.`);
  }
}

function assertReferences(
  references: readonly string[],
  knownIds: ReadonlySet<string>,
  label: string,
) {
  if (!references.length) {
    throw new Error(`${label} requires at least one reference.`);
  }
  references.forEach((reference) => {
    if (!knownIds.has(reference)) {
      throw new Error(`${label} references unknown ID ${reference}.`);
    }
  });
}

function containsPlaceholder(value: string) {
  return /placeholder|illustrative|synthetic|\[[^\]]+\]/i.test(value);
}

export function validateNockReportData() {
  assertNonEmpty(metricDefinitions, "metric definition");
  assertNonEmpty(reportPoints, "data point");
  assertNonEmpty(reportCues, "chart cue");
  assertNonEmpty(narrativeSections, "narrative section");
  assertNonEmpty(reportSources, "source definition");
  assertNonEmpty(reportStages, "stage definition");
  assertNonEmpty(reportAnnotations, "annotation definition");

  assertUnique(metricDefinitions.map((metric) => metric.key), "metric key");
  assertUnique(reportPoints.map((point) => point.id), "point ID");
  assertUnique(reportCues.map((cue) => cue.id), "cue ID");
  assertUnique(narrativeSections.map((section) => section.id), "section ID");
  assertUnique(reportSources.map((source) => source.id), "source ID");
  assertUnique(reportStages.map((stage) => stage.id), "stage ID");
  assertUnique(reportAnnotations.map((annotation) => annotation.id), "annotation ID");

  const metricKeys = new Set(metricDefinitions.map((metric) => metric.key));
  const cueIds = new Set(reportCues.map((cue) => cue.id));
  const pointIds = new Set(reportPoints.map((point) => point.id));
  const sourceIds = new Set(reportSources.map((source) => source.id));
  const stageIds = new Set(reportStages.map((stage) => stage.id));
  const annotationIds = new Set(reportAnnotations.map((annotation) => annotation.id));
  const sectionIds = new Set([
    "cover",
    "close",
    ...narrativeSections.map((section) => section.id),
  ]);
  const primaryMetric = metricDefinitions.find((metric) => metric.key === "tokenValue");

  if (
    metricDefinitions.length !== requiredMetricKeys.length ||
    requiredMetricKeys.some((key) => !metricKeys.has(key))
  ) {
    throw new Error(
      `Nock report metrics must define exactly: ${requiredMetricKeys.join(", ")}.`,
    );
  }

  reportSources.forEach((source) => {
    if (!source.label || !source.kind || !source.dataStatus) {
      throw new Error(`Source ${source.id} is missing label, kind, or status metadata.`);
    }
  });

  reportStages.forEach((stage) => {
    if (!sectionIds.has(stage.sectionId)) {
      throw new Error(`Stage ${stage.id} references unknown section ${stage.sectionId}.`);
    }
  });

  reportAnnotations.forEach((annotation) => {
    assertReferences(annotation.sourceIds, sourceIds, `Annotation ${annotation.id}`);
    if (!annotation.label || !annotation.dataStatus) {
      throw new Error(`Annotation ${annotation.id} is missing label or status metadata.`);
    }
  });

  metricDefinitions.forEach((metric) => {
    const [minimum, maximum] = metric.domain;
    if (
      !metric.unit ||
      !metric.chartUnit ||
      !metric.formatter ||
      !Number.isFinite(minimum) ||
      !Number.isFinite(maximum) ||
      !Number.isFinite(metric.activationProgress)
    ) {
      throw new Error(`Metric ${metric.key} is missing a valid unit, formatter, or scale range.`);
    }
    if (minimum >= maximum) {
      throw new Error(`Metric ${metric.key} must have an ascending scale range.`);
    }
    if (metric.scaleType === "log" && minimum <= 0) {
      throw new Error(`Logarithmic metric ${metric.key} must have a positive scale range.`);
    }
    if (metric.activationProgress < 0 || metric.activationProgress >= 1) {
      throw new Error(`Metric ${metric.key} has an invalid activation point.`);
    }
    assertReferences(metric.sourceIds, sourceIds, `Metric ${metric.key}`);
  });

  metricDefinitions.forEach((metric) => {
    const [minimum, maximum] = metric.domain;
    const activationPoint = reportPoints.find(
      (point) => point.progress === metric.activationProgress,
    );
    let previousActiveValue: number | null = null;

    if (!activationPoint || activationPoint[metric.key] !== minimum) {
      throw new Error(
        `Metric ${metric.key} must activate at its lower scale boundary.`,
      );
    }

    reportPoints.forEach((point) => {
      const value = point[metric.key];
      if (point.progress < metric.activationProgress) {
        if (value !== 0) {
          throw new Error(
            `Metric ${metric.key} must remain zero before activation.`,
          );
        }
        return;
      }

      if (metric.scaleType === "log" && value <= 0) {
        throw new Error(
          `Logarithmic metric ${metric.key} contains a non-positive active value.`,
        );
      }
      if (value < minimum || value > maximum) {
        throw new Error(`Metric ${metric.key} falls outside its active scale range.`);
      }
      if (previousActiveValue !== null && value <= previousActiveValue) {
        throw new Error(`Metric ${metric.key} must rise after activation.`);
      }
      previousActiveValue = value;
    });
  });

  reportPoints.forEach((point) => {
    const numericValues = [
      point.progress,
      point.tokenValue,
      point.workRate,
      point.inferenceRevenue,
      point.globalConsumption,
    ];
    if (numericValues.some((value) => !Number.isFinite(value))) {
      throw new Error(`Point ${point.id} contains a non-finite value.`);
    }
    if (point.progress < 0 || point.progress > 1) {
      throw new Error(`Point ${point.id} has progress outside 0–1.`);
    }
    if (point.globalConsumption < 0 || point.globalConsumption > 100) {
      throw new Error(`Point ${point.id} has a percentage outside 0–100.`);
    }
    if (!stageIds.has(point.stageId)) {
      throw new Error(`Point ${point.id} references unknown stage ${point.stageId}.`);
    }
    if (!point.classification) {
      throw new Error(`Point ${point.id} is missing source classification metadata.`);
    }
    if (!point.stageSummary.trim()) {
      throw new Error(`Point ${point.id} requires stage-summary copy.`);
    }
    assertReferences(point.sourceIds, sourceIds, `Point ${point.id}`);
    point.annotationIds?.forEach((annotationId) => {
      if (!annotationIds.has(annotationId)) {
        throw new Error(`Point ${point.id} references unknown annotation ${annotationId}.`);
      }
    });
    point.uncertainty?.forEach((range) => {
      const metric = metricDefinitions.find((candidate) => candidate.key === range.metric);
      if (
        !metric ||
        !Number.isFinite(range.low) ||
        !Number.isFinite(range.high) ||
        range.low > range.high ||
        (metric.scaleType === "log" && range.low <= 0)
      ) {
        throw new Error(`Point ${point.id} has an invalid uncertainty range.`);
      }
    });
  });

  reportPoints.forEach((point, index) => {
    if (index > 0 && point.progress <= reportPoints[index - 1].progress) {
      throw new Error("Nock report points must have strictly increasing progress values.");
    }
  });

  if (reportPoints[0].stageId !== "primer" || reportPoints[0].progress !== 0) {
    throw new Error("The plotted progression must begin with Primer at progress 0.");
  }

  const terminalPoint = reportPoints[reportPoints.length - 1];
  if (terminalPoint.progress !== 1) {
    throw new Error("The final Nock report point must resolve at progress 1.");
  }
  metricDefinitions.forEach((metric) => {
    const maximum = metric.domain[1];
    const tolerance = Math.max(1, Math.abs(maximum) * Number.EPSILON * 8);
    if (Math.abs(terminalPoint[metric.key] - maximum) > tolerance) {
      throw new Error(
        `Metric ${metric.key} must finish at its upper scale boundary.`,
      );
    }
  });

  reportCues.forEach((cue) => {
    if (!sectionIds.has(cue.sectionId)) {
      throw new Error(`Cue ${cue.id} references unknown section ${cue.sectionId}.`);
    }
    const stage = reportStages.find((candidate) => candidate.id === cue.stageId);
    if (!stage || stage.sectionId !== cue.sectionId) {
      throw new Error(`Cue ${cue.id} does not resolve to its declared section and stage.`);
    }
    if (!metricKeys.has(cue.activeMetric)) {
      throw new Error(`Cue ${cue.id} references unknown metric ${cue.activeMetric}.`);
    }
    if (
      !cue.activatedMetrics.length ||
      new Set(cue.activatedMetrics).size !== cue.activatedMetrics.length ||
      cue.activatedMetrics.some((metric) => !metricKeys.has(metric))
    ) {
      throw new Error(`Cue ${cue.id} has invalid metric activation metadata.`);
    }
    if (!pointIds.has(cue.emphasizedPointId)) {
      throw new Error(`Cue ${cue.id} references unknown point ${cue.emphasizedPointId}.`);
    }
    assertReferences(cue.annotationIds, annotationIds, `Cue ${cue.id}`);
    if (!Number.isFinite(cue.domainMax) || cue.domainMax <= 0) {
      throw new Error(`Cue ${cue.id} has an invalid primary scale range.`);
    }
    if (
      primaryMetric?.scaleType === "log" &&
      cue.domainMax <= primaryMetric.domain[0]
    ) {
      throw new Error(`Cue ${cue.id} must exceed the logarithmic primary minimum.`);
    }
    if (
      cue.visibleRange.some((value) => !Number.isFinite(value)) ||
      cue.visibleRange[0] < 0 ||
      cue.visibleRange[1] > 1 ||
      cue.visibleRange[0] > cue.visibleRange[1]
    ) {
      throw new Error(`Cue ${cue.id} has an invalid visible range.`);
    }
    const revealEntries = Object.entries(cue.reveal);
    if (
      revealEntries.length !== requiredMetricKeys.length ||
      requiredMetricKeys.some((key) => !(key in cue.reveal))
    ) {
      throw new Error(`Cue ${cue.id} must define a reveal value for every metric.`);
    }
    revealEntries.forEach(([metric, reveal]) => {
      if (
        !metricKeys.has(metric as MetricKey) ||
        !Number.isFinite(reveal) ||
        reveal < 0 ||
        reveal > 1
      ) {
        throw new Error(`Cue ${cue.id} has an invalid reveal value for ${metric}.`);
      }
    });

    if (cue.sectionId !== "cover") {
      const orderedReveal = requiredMetricKeys.map((key) => cue.reveal[key]);
      if (orderedReveal.some((reveal) => reveal <= 0)) {
        throw new Error(`Cue ${cue.id} must advance time for all four metrics.`);
      }
      if (
        orderedReveal.some(
          (reveal, index) => index > 0 && orderedReveal[index - 1] < reveal,
        )
      ) {
        throw new Error(
          `Cue ${cue.id} must reveal metrics from fastest to slowest in plot order.`,
        );
      }
    }
  });

  requiredMetricKeys.forEach((key) => {
    let wasActivated = false;
    reportCues.forEach((cue) => {
      const isActivated = cue.activatedMetrics.includes(key);
      if (wasActivated && !isActivated) {
        throw new Error(`Metric ${key} cannot deactivate in a later cue.`);
      }
      wasActivated ||= isActivated;
    });
  });

  const finalPrimerCue = [...reportCues]
    .reverse()
    .find((cue) => cue.stageId === "primer");
  const stageOneCue = reportCues.find((cue) => cue.stageId === "stage-1");
  (["inferenceRevenue", "globalConsumption"] as const).forEach((key) => {
    const metric = metricDefinitions.find((candidate) => candidate.key === key);
    if (
      !metric ||
      !finalPrimerCue ||
      !stageOneCue ||
      finalPrimerCue.activatedMetrics.includes(key) ||
      finalPrimerCue.reveal[key] !== metric.activationProgress ||
      !stageOneCue.activatedMetrics.includes(key)
    ) {
      throw new Error(
        `Metric ${key} must travel at zero through Primer and activate at Stage 1.`,
      );
    }
  });

  const terminalCue = reportCues.find((cue) => cue.stageId === "stage-3");
  if (
    !terminalCue ||
    requiredMetricKeys.some((key) => terminalCue.reveal[key] !== 1)
  ) {
    throw new Error("The terminal Nock report cue must reveal every metric at progress 1.");
  }

  narrativeSections.forEach((section) => {
    assertNonEmpty(section.steps, `scroll step in section ${section.id}`);
    section.steps.forEach((step) => {
      const cue = reportCues.find((candidate) => candidate.id === step.cueId);
      if (!cueIds.has(step.cueId) || cue?.sectionId !== section.id) {
        throw new Error(`Narrative step ${step.cueId} does not resolve to section ${section.id}.`);
      }
      if (step.sourceIds) {
        assertReferences(step.sourceIds, sourceIds, `Narrative step ${step.cueId}`);
      }
      if (step.riskIds) {
        assertReferences(step.riskIds, sourceIds, `Narrative risk ${step.cueId}`);
      }
    });
  });

  const narrativeText = narrativeSections.flatMap((section) => [
    section.heading,
    section.summary,
    ...section.steps.flatMap((step) => [
      step.heading,
      ...step.paragraphs,
      step.note ?? "",
    ]),
  ]);
  const metadataText = [
    reportMetadata.author,
    reportMetadata.publishedAt,
    reportMetadata.updatedAt,
    reportMetadata.revision,
    reportMetadata.readingTime,
  ];
  const evidenceText = [
    ...metricDefinitions.flatMap((metric) => [
      metric.label,
      metric.shortLabel,
      metric.unit,
      metric.chartUnit,
      metric.accessibilityDescription,
    ]),
    ...reportSources.map((source) => source.label),
    ...reportAnnotations.map((annotation) => annotation.label),
    ...reportPoints.map((point) => point.stageSummary),
    ...reportCues.flatMap((cue) => [cue.annotation, cue.summary]),
    ...reportClosingSections.flatMap((section) => [section.heading, section.body]),
  ];
  const publicationBlockers = [
    reportMetadata.dataStatus !== "final" ? "report data status is not final" : null,
    reportMetadata.disclosureStatus !== "complete" ? "disclosures are incomplete" : null,
    metricDefinitions.some((metric) => metric.dataStatus !== "final")
      ? "one or more metrics are not final"
      : null,
    reportSources.some((source) => source.dataStatus !== "final")
      ? "one or more source records are unresolved"
      : null,
    reportAnnotations.some((annotation) => annotation.dataStatus !== "final")
      ? "one or more annotations are unresolved"
      : null,
    [...narrativeText, ...metadataText, ...evidenceText].some(containsPlaceholder)
      ? "editorial, evidence, or metadata placeholders remain"
      : null,
  ].filter((blocker): blocker is string => Boolean(blocker));

  if (publicationBlockers.length) {
    return {
      publicationReady: false,
      warning: `Nock report is not publication-ready: ${publicationBlockers.join("; ")}.`,
      blockers: publicationBlockers,
    } as const;
  }

  return { publicationReady: true, warning: null, blockers: [] } as const;
}

export const reportValidation = validateNockReportData();

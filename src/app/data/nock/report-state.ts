import type { MetricKey, ReportCue, ReportViewState } from "./report-types";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function resolveReportViewState(
  cues: readonly ReportCue[],
  cueIndex: number,
  cueProgress: number,
  reducedMotion: boolean,
): ReportViewState {
  const boundedIndex = Math.min(Math.max(cueIndex, 0), cues.length - 1);
  const target = cues[boundedIndex];
  const start = cues[Math.max(0, boundedIndex - 1)];
  const progress = reducedMotion || boundedIndex === 0 ? 1 : clamp(cueProgress);
  const metricKeys = Object.keys(target.reveal) as MetricKey[];

  const reveal = metricKeys.reduce(
    (values, key) => ({
      ...values,
      [key]: mix(start.reveal[key], target.reveal[key], progress),
    }),
    {} as ReportViewState["reveal"],
  );

  return {
    cueId: target.id,
    sectionId: target.sectionId,
    chapterIndex: target.chapterIndex,
    chapterLabel: target.chapterLabel,
    activeMetric: target.activeMetric,
    activatedMetrics: target.activatedMetrics,
    domainMax: mix(start.domainMax, target.domainMax, progress),
    reveal,
    annotation: target.annotation,
    annotationIds: target.annotationIds,
    emphasizedPointId: target.emphasizedPointId,
    visibleRange: [
      mix(start.visibleRange[0], target.visibleRange[0], progress),
      mix(start.visibleRange[1], target.visibleRange[1], progress),
    ],
    summary: target.summary,
  };
}

export function clampUnit(value: number) {
  return clamp(value);
}

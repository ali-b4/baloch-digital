export type MetricKey =
  | "tokenValue"
  | "workRate"
  | "inferenceRevenue"
  | "globalConsumption";

export type FormatterKey = "currency" | "emac" | "revenue" | "percent";
export type DataClassification = "observed" | "assumed" | "modeled";
export type DataStatus = "placeholder" | "draft" | "final";
export type DisclosureStatus = "required" | "draft" | "complete";

export type ReportMetadata = {
  assetName: string;
  ticker: string;
  reportType: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  revision: string;
  readingTime: string;
  dataStatus: DataStatus;
  disclosureStatus: DisclosureStatus;
};

export type SourceDefinition = {
  id: string;
  label: string;
  kind: "source" | "assumption" | "risk" | "disclosure";
  dataStatus: DataStatus;
  href?: string;
};

export type StageDefinition = {
  id: string;
  sectionId: string;
  label: string;
};

export type AnnotationDefinition = {
  id: string;
  label: string;
  sourceIds: readonly string[];
  dataStatus: DataStatus;
};

export type MetricDefinition = {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  chartUnit: string;
  formatter: FormatterKey;
  scaleType: "linear" | "log";
  domain: readonly [number, number];
  activationProgress: number;
  pattern: "solid" | "dash" | "area" | "dot";
  accessibilityDescription: string;
  dataStatus: DataStatus;
  sourceIds: readonly string[];
};

export type UncertaintyRange = {
  metric: MetricKey;
  low: number;
  high: number;
};

export type ReportPoint = {
  id: string;
  stageId: string;
  progress: number;
  milestone: string;
  stageSummary: string;
  tokenValue: number;
  workRate: number;
  inferenceRevenue: number;
  globalConsumption: number;
  classification: DataClassification;
  sourceIds: readonly string[];
  uncertainty?: readonly UncertaintyRange[];
  annotationIds?: readonly string[];
};

export type MetricReveal = Record<MetricKey, number>;

export type ReportCue = {
  id: string;
  sectionId: string;
  stageId: string;
  chapterIndex: number;
  chapterLabel: string;
  activeMetric: MetricKey;
  activatedMetrics: readonly MetricKey[];
  domainMax: number;
  reveal: MetricReveal;
  annotation: string;
  annotationIds: readonly string[];
  emphasizedPointId: string;
  visibleRange: readonly [number, number];
  summary: string;
};

export type NarrativeStep = {
  cueId: string;
  heading: string;
  paragraphs: readonly string[];
  note?: string;
  sourceIds?: readonly string[];
  riskIds?: readonly string[];
};

export type NarrativeSection = {
  id: string;
  navigationLabel: string;
  chapterIndex: number;
  heading: string;
  summary: string;
  steps: readonly NarrativeStep[];
};

export type ReportViewState = {
  cueId: string;
  sectionId: string;
  chapterIndex: number;
  chapterLabel: string;
  activeMetric: MetricKey;
  activatedMetrics: readonly MetricKey[];
  domainMax: number;
  reveal: MetricReveal;
  annotation: string;
  annotationIds: readonly string[];
  emphasizedPointId: string;
  visibleRange: readonly [number, number];
  summary: string;
};

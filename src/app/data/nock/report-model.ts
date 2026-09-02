import type { MetricDefinition, MetricKey, ReportPoint } from "./report-types";

export const reportStageProgress = {
  primer: 0,
  stage1: 0.325,
  stage2: 0.65,
  stage3: 1,
} as const;

export const metricActivationProgress = {
  tokenValue: reportStageProgress.primer,
  workRate: reportStageProgress.primer,
  inferenceRevenue: reportStageProgress.stage1,
  globalConsumption: reportStageProgress.stage1,
} as const satisfies Record<MetricKey, number>;

export function stagedLogValue(
  domain: readonly [number, number],
  progress: number,
  activationProgress: number,
) {
  if (progress < activationProgress) {
    return 0;
  }

  const [minimum, maximum] = domain;
  const activeProgress =
    activationProgress === 1
      ? 1
      : (progress - activationProgress) / (1 - activationProgress);

  return minimum * (maximum / minimum) ** activeProgress;
}

export function isStagePointVisible(
  revealProgress: number,
  stageProgress: number,
  activationProgress: number,
  activated: boolean,
) {
  const lineHasReachedStage =
    revealProgress > 0 && stageProgress <= revealProgress;
  const stageValueIsAvailable =
    stageProgress < activationProgress || activated;

  return lineHasReachedStage && stageValueIsAvailable;
}

export function sampleMetric(
  points: readonly ReportPoint[],
  metric: MetricDefinition,
  progress: number,
  activated = true,
) {
  const { key, scaleType } = metric;

  if (!activated && metric.activationProgress > 0) {
    return 0;
  }
  if (progress <= points[0].progress) {
    return points[0][key];
  }

  for (let index = 1; index < points.length; index += 1) {
    const current = points[index];
    if (progress <= current.progress) {
      const previous = points[index - 1];
      const previousValue = previous[key];
      const currentValue = current[key];

      if (previousValue <= 0 || currentValue <= 0) {
        return previousValue <= 0 &&
          currentValue > 0 &&
          progress >= current.progress
          ? currentValue
          : 0;
      }

      const span = current.progress - previous.progress;
      const localProgress = span === 0 ? 1 : (progress - previous.progress) / span;
      if (scaleType === "log") {
        return Math.exp(
          Math.log(previousValue) +
            (Math.log(currentValue) - Math.log(previousValue)) * localProgress,
        );
      }
      return previousValue + (currentValue - previousValue) * localProgress;
    }
  }

  return points[points.length - 1][key];
}

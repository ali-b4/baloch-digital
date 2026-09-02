"use client";

import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import type {
  MetricDefinition,
  MetricKey,
  ReportPoint,
  ReportViewState,
} from "./report-types";
import { formatChartMetricValue, formatMetricValue } from "./report-format";
import { isStagePointVisible, sampleMetric } from "./report-model";
import styles from "./report.module.css";

type ReportChartProps = {
  idPrefix: string;
  primaryMetricKey: MetricKey;
  compact?: boolean;
  enableStageInspection?: boolean;
  metrics: readonly MetricDefinition[];
  points: readonly ReportPoint[];
  viewState: ReportViewState;
};

const plot = {
  left: 78,
  right: 724,
  primaryTop: 58,
  primaryBottom: 330,
  trackHeight: 58,
  trackGap: 30,
};

const CURVE_SAMPLE_COUNT = 72;
const ACTIVATION_STEP_HEIGHT = 8;
const ZERO_BASELINE_INSET = 2;

const patternClasses: Record<MetricDefinition["pattern"], string> = {
  solid: styles.auxSolid,
  dash: styles.auxDash,
  area: styles.auxArea,
  dot: styles.auxDot,
};

const railStageLabels: Readonly<Record<string, string>> = {
  primer: "PRIMER",
  "stage-1": "STG 1",
  "stage-2": "STG 2",
  "stage-3": "STG 3",
};

function xPosition(progress: number) {
  return plot.left + progress * (plot.right - plot.left);
}

function zeroBaselineY(bottom: number) {
  return bottom - ZERO_BASELINE_INSET;
}

function yPosition(
  value: number,
  domain: readonly [number, number],
  top: number,
  bottom: number,
  scaleType: MetricDefinition["scaleType"],
  activationProgress = 0,
) {
  if (value <= 0) {
    return zeroBaselineY(bottom);
  }

  const [minimum, maximum] = domain;
  const normalized =
    scaleType === "log"
      ? (Math.log(value) - Math.log(minimum)) /
        (Math.log(maximum) - Math.log(minimum))
      : (value - minimum) / (maximum - minimum);
  const activeBottom =
    activationProgress > 0
      ? bottom - Math.min(ACTIVATION_STEP_HEIGHT, (bottom - top) * 0.14)
      : bottom;
  return activeBottom - normalized * (activeBottom - top);
}

function linePath(
  points: readonly ReportPoint[],
  metric: MetricDefinition,
  domain: readonly [number, number],
  top: number,
  bottom: number,
) {
  const sampleProgress = Array.from(
    new Set([
      ...Array.from(
        { length: CURVE_SAMPLE_COUNT + 1 },
        (_, index) => index / CURVE_SAMPLE_COUNT,
      ),
      ...points.map((point) => point.progress),
    ]),
  ).sort((a, b) => a - b);

  const samples = sampleProgress.map((progress) => ({
    progress,
    value: sampleMetric(points, metric, progress),
  }));
  const commands: string[] = [];

  samples.forEach((sample, index) => {
    const x = xPosition(sample.progress).toFixed(2);
    const y = yPosition(
      sample.value,
      domain,
      top,
      bottom,
      metric.scaleType,
      metric.activationProgress,
    ).toFixed(2);
    const previousValue = index > 0 ? samples[index - 1].value : null;

    if (previousValue !== null && previousValue <= 0 && sample.value > 0) {
      commands.push(`L ${x} ${zeroBaselineY(bottom).toFixed(2)}`, `L ${x} ${y}`);
      return;
    }

    commands.push(`${index === 0 ? "M" : "L"} ${x} ${y}`);
  });

  return commands.join(" ");
}

function zeroBaselinePath(progress: number, bottom: number) {
  const y = zeroBaselineY(bottom).toFixed(2);
  return `M ${xPosition(0).toFixed(2)} ${y} L ${xPosition(progress).toFixed(2)} ${y}`;
}

function areaPath(
  points: readonly ReportPoint[],
  metric: MetricDefinition,
  domain: readonly [number, number],
  top: number,
  bottom: number,
) {
  const line = linePath(points, metric, domain, top, bottom);
  const baseline = zeroBaselineY(bottom);
  return `${line} L ${xPosition(1)} ${baseline} L ${xPosition(0)} ${baseline} Z`;
}

function uncertaintyBandPath(
  points: readonly ReportPoint[],
  metric: MetricDefinition,
  domain: readonly [number, number],
  top: number,
  bottom: number,
) {
  const samples = points.flatMap((point) => {
    const range = point.uncertainty?.find(
      (candidate) => candidate.metric === metric.key,
    );
    return range ? [{ point, range }] : [];
  });

  if (samples.length < 2) {
    return null;
  }

  const upper = samples
    .map(({ point, range }, index) => {
      const x = xPosition(point.progress);
      const y = yPosition(
        range.high,
        domain,
        top,
        bottom,
        metric.scaleType,
        metric.activationProgress,
      );
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const lower = [...samples]
    .reverse()
    .map(({ point, range }) => {
      const x = xPosition(point.progress);
      const y = yPosition(
        range.low,
        domain,
        top,
        bottom,
        metric.scaleType,
        metric.activationProgress,
      );
      return `L ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return `${upper} ${lower} Z`;
}

function metricDefinition(metrics: readonly MetricDefinition[], key: MetricKey) {
  const metric = metrics.find((candidate) => candidate.key === key);
  if (!metric) {
    throw new Error(`Missing metric definition for ${key}.`);
  }
  return metric;
}

function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

function nearestPointIndex(points: readonly ReportPoint[], progress: number) {
  return points.reduce(
    (nearestIndex, point, index) =>
      Math.abs(point.progress - progress) <
      Math.abs(points[nearestIndex].progress - progress)
        ? index
        : nearestIndex,
    0,
  );
}

export default function ReportChart({
  idPrefix,
  primaryMetricKey,
  compact = false,
  enableStageInspection = false,
  metrics,
  points,
  viewState,
}: ReportChartProps) {
  const [inspectionProgress, setInspectionProgress] = useState<number | null>(null);
  const pointerInsideRef = useRef(false);
  const keyboardFocusRef = useRef(false);
  const hoverDismissedRef = useRef(false);
  const pointerBoundsRef = useRef<DOMRect | null>(null);
  const pendingInspectionProgressRef = useRef<number | null>(null);
  const inspectionFrameRef = useRef(0);
  const primaryMetric = metricDefinition(metrics, primaryMetricKey);
  const trackOrder = metrics
    .filter((metric) => metric.key !== primaryMetricKey)
    .map((metric) => metric.key);
  const visibleTrackOrder = compact ? [] : trackOrder;
  const primaryMinimum = primaryMetric.domain[0];
  const primaryDomain: readonly [number, number] = [
    primaryMinimum,
    Math.max(primaryMinimum + Number.EPSILON, viewState.domainMax),
  ];
  const primaryReveal = viewState.reveal[primaryMetricKey];
  const primaryIsActivated =
    viewState.activatedMetrics.includes(primaryMetricKey);
  const primaryValue = sampleMetric(
    points,
    primaryMetric,
    primaryReveal,
    primaryIsActivated,
  );
  const primaryX = xPosition(primaryReveal);
  const primaryY = yPosition(
    primaryValue,
    primaryDomain,
    plot.primaryTop,
    plot.primaryBottom,
    primaryMetric.scaleType,
    primaryMetric.activationProgress,
  );
  const primaryUncertaintyPath = uncertaintyBandPath(
    points,
    primaryMetric,
    primaryDomain,
    plot.primaryTop,
    plot.primaryBottom,
  );
  const primaryPathData = linePath(
    points,
    primaryMetric,
    primaryDomain,
    plot.primaryTop,
    plot.primaryBottom,
  );
  const chartBottom =
    plot.primaryBottom +
    plot.trackGap +
    visibleTrackOrder.length * plot.trackHeight +
    (visibleTrackOrder.length - 1) * plot.trackGap;
  const viewBoxHeight = chartBottom + 70;
  const isInspecting =
    enableStageInspection && !compact && inspectionProgress !== null;
  const inspectionStageIndex = isInspecting
    ? nearestPointIndex(points, inspectionProgress)
    : null;
  const inspectionPoint =
    inspectionStageIndex === null ? null : points[inspectionStageIndex];
  const inspectionValue = isInspecting
    ? sampleMetric(points, primaryMetric, inspectionProgress)
    : null;
  const inspectionX = isInspecting ? xPosition(inspectionProgress) : null;
  const inspectionY =
    inspectionValue === null
      ? null
      : yPosition(
          inspectionValue,
          primaryDomain,
          plot.primaryTop,
          plot.primaryBottom,
          primaryMetric.scaleType,
          primaryMetric.activationProgress,
        );
  const keyboardStageIndex =
    inspectionStageIndex ?? nearestPointIndex(points, primaryReveal);
  const captionId = `${idPrefix}-caption`;
  const primaryClipId = `${idPrefix}-primary-clip`;

  const cancelPendingInspection = () => {
    if (inspectionFrameRef.current) {
      window.cancelAnimationFrame(inspectionFrameRef.current);
      inspectionFrameRef.current = 0;
    }
    pendingInspectionProgressRef.current = null;
  };

  const updateInspectionFromPointer = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      !enableStageInspection ||
      event.pointerType === "touch" ||
      hoverDismissedRef.current
    ) {
      return;
    }

    const bounds =
      pointerBoundsRef.current ?? event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }

    pointerBoundsRef.current = bounds;
    pointerInsideRef.current = true;
    pendingInspectionProgressRef.current = clampProgress(
      (event.clientX - bounds.left) / bounds.width,
    );

    if (!inspectionFrameRef.current) {
      inspectionFrameRef.current = window.requestAnimationFrame(() => {
        inspectionFrameRef.current = 0;
        const nextProgress = pendingInspectionProgressRef.current;
        pendingInspectionProgressRef.current = null;
        if (nextProgress !== null) {
          setInspectionProgress(nextProgress);
        }
      });
    }
  };

  const handleInspectionPointerLeave = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!enableStageInspection || event.pointerType === "touch") {
      return;
    }

    cancelPendingInspection();
    hoverDismissedRef.current = false;
    pointerBoundsRef.current = null;
    pointerInsideRef.current = false;
    if (!keyboardFocusRef.current) {
      setInspectionProgress(null);
    }
  };

  const handleInspectionKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextIndex = Math.max(0, keyboardStageIndex - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextIndex = Math.min(points.length - 1, keyboardStageIndex + 1);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = points.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelPendingInspection();
      hoverDismissedRef.current = true;
      pointerInsideRef.current = false;
      setInspectionProgress(null);
      event.currentTarget.blur();
      return;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setInspectionProgress(points[nextIndex].progress);
    }
  };

  useEffect(() => {
    if (!enableStageInspection) {
      return;
    }

    const clearPointerInspection = () => {
      if (!pointerInsideRef.current || keyboardFocusRef.current) {
        return;
      }

      if (inspectionFrameRef.current) {
        window.cancelAnimationFrame(inspectionFrameRef.current);
        inspectionFrameRef.current = 0;
      }
      pendingInspectionProgressRef.current = null;
      hoverDismissedRef.current = true;
      pointerBoundsRef.current = null;
      setInspectionProgress(null);
    };

    window.addEventListener("scroll", clearPointerInspection, { passive: true });
    window.addEventListener("wheel", clearPointerInspection, { passive: true });

    return () => {
      window.removeEventListener("scroll", clearPointerInspection);
      window.removeEventListener("wheel", clearPointerInspection);
    };
  }, [enableStageInspection]);

  useEffect(() => {
    if (!isInspecting) {
      return;
    }

    const dismissInspection = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (inspectionFrameRef.current) {
        window.cancelAnimationFrame(inspectionFrameRef.current);
        inspectionFrameRef.current = 0;
      }
      pendingInspectionProgressRef.current = null;
      hoverDismissedRef.current = true;
      setInspectionProgress(null);
    };

    window.addEventListener("keydown", dismissInspection);
    return () => window.removeEventListener("keydown", dismissInspection);
  }, [isInspecting]);

  useEffect(
    () => () => {
      if (inspectionFrameRef.current) {
        window.cancelAnimationFrame(inspectionFrameRef.current);
      }
    },
    [],
  );

  return (
    <figure
      className={`${styles.chart}${compact ? ` ${styles.compactChart}` : ""}`}
      aria-labelledby={captionId}
      data-annotation-state={viewState.annotationIds.join(" ")}
    >
      <div
        className={styles.chartPlot}
        onPointerLeave={handleInspectionPointerLeave}
      >
        <svg
          className={styles.chartSvg}
          viewBox={`0 0 760 ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
        <defs>
          <clipPath id={primaryClipId}>
            <rect
              x={plot.left}
              y={plot.primaryTop - 14}
              width={(plot.right - plot.left) * primaryReveal}
              height={plot.primaryBottom - plot.primaryTop + 28}
            />
          </clipPath>
          {visibleTrackOrder.map((key) => (
            <clipPath id={`${idPrefix}-${key}-reveal`} key={key}>
              <rect
                x={plot.left}
                y={0}
                width={(plot.right - plot.left) * viewState.reveal[key]}
                height={chartBottom + 70}
              />
            </clipPath>
          ))}
        </defs>

        <g className={styles.stageGuides}>
          {points.map((point, index) => (
            <line
              className={
                inspectionStageIndex === index ? styles.activeStageGuide : undefined
              }
              key={point.id}
              x1={xPosition(point.progress)}
              x2={xPosition(point.progress)}
              y1={plot.primaryTop}
              y2={chartBottom + 20}
            />
          ))}
        </g>

        <rect
          className={styles.plotFrame}
          x={plot.left}
          y={plot.primaryTop}
          width={plot.right - plot.left}
          height={plot.primaryBottom - plot.primaryTop}
        />

        <rect
          className={styles.visibleWindow}
          x={xPosition(viewState.visibleRange[0])}
          y={plot.primaryTop}
          width={
            (viewState.visibleRange[1] - viewState.visibleRange[0]) *
            (plot.right - plot.left)
          }
          height={plot.primaryBottom - plot.primaryTop}
        />

        <path className={styles.primaryReferencePath} d={primaryPathData} />

        <g clipPath={`url(#${primaryClipId})`}>
          {primaryUncertaintyPath ? (
            <path className={styles.uncertaintyBand} d={primaryUncertaintyPath} />
          ) : null}
          <path className={styles.primaryPath} d={primaryPathData} />
        </g>
        <g>
          <line
            className={styles.crosshair}
            x1={primaryX}
            x2={primaryX}
            y1={plot.primaryTop}
            y2={plot.primaryBottom}
          />
          <line
            className={styles.crosshair}
            x1={plot.left}
            x2={plot.right}
            y1={primaryY}
            y2={primaryY}
          />
          <circle className={styles.leadingPointHalo} cx={primaryX} cy={primaryY} r="12" />
          <circle className={styles.leadingPoint} cx={primaryX} cy={primaryY} r="4" />
        </g>
        <g className={styles.stagePoints}>
          {points.map((point) =>
            isStagePointVisible(
              primaryReveal,
              point.progress,
              primaryMetric.activationProgress,
              primaryIsActivated,
            ) ? (
              <circle
                className={styles.stagePoint}
                cx={xPosition(point.progress)}
                cy={yPosition(
                  point[primaryMetricKey],
                  primaryDomain,
                  plot.primaryTop,
                  plot.primaryBottom,
                  primaryMetric.scaleType,
                  primaryMetric.activationProgress,
                )}
                key={point.id}
                r="2.75"
              />
            ) : null,
          )}
        </g>

        {inspectionProgress !== null &&
        inspectionX !== null &&
        inspectionY !== null &&
        inspectionValue !== null &&
        inspectionPoint ? (
          <g className={styles.inspectionCursor}>
            <line
              x1={inspectionX}
              x2={inspectionX}
              y1={plot.primaryTop}
              y2={plot.primaryBottom}
            />
            <circle cx={inspectionX} cy={inspectionY} r="4.5" />
            <text
              x={inspectionX}
              y={plot.primaryBottom - 11}
              textAnchor={
                inspectionProgress < 0.14
                  ? "start"
                  : inspectionProgress > 0.86
                    ? "end"
                    : "middle"
              }
            >
              {`${inspectionPoint.milestone.toUpperCase()} // ${formatMetricValue(inspectionValue, primaryMetric.formatter)}`}
            </text>
          </g>
        ) : null}

        <g className={styles.primaryLabels}>
          <text x={plot.left} y={plot.primaryTop - 18}>
            {primaryMetric.label}
          </text>
          <text
            className={styles.metricValue}
            x={plot.right}
            y={plot.primaryTop - 18}
            textAnchor="end"
          >
            {formatChartMetricValue(
              inspectionValue ?? primaryValue,
              primaryMetric.formatter,
            )}
          </text>
        </g>

        <g
          className={`${styles.auxTracksLayer}${isInspecting ? ` ${styles.isHidden}` : ""}`}
        >
          {visibleTrackOrder.map((key, index) => {
            const metric = metricDefinition(metrics, key);
            const top =
              plot.primaryBottom +
              plot.trackGap +
              index * (plot.trackHeight + plot.trackGap);
            const bottom = top + plot.trackHeight;
            const reveal = viewState.reveal[key];
            const isActivated = viewState.activatedMetrics.includes(key);
            const value = sampleMetric(points, metric, reveal, isActivated);
            const markerX = xPosition(reveal);
            const markerY = yPosition(
              value,
              metric.domain,
              top,
              bottom,
              metric.scaleType,
              metric.activationProgress,
            );
            const isActive = key === viewState.activeMetric;

            return (
              <g
                className={`${styles.auxTrack} ${patternClasses[metric.pattern]}${isActive ? ` ${styles.active}` : ""}`}
                key={key}
              >
                <rect
                  className={styles.plotFrame}
                  x={plot.left}
                  y={top}
                  width={plot.right - plot.left}
                  height={bottom - top}
                />
                <g clipPath={`url(#${idPrefix}-${key}-reveal)`}>
                  {metric.pattern === "area" && isActivated ? (
                    <path
                      className={styles.trackArea}
                      d={areaPath(
                        points,
                        metric,
                        metric.domain,
                        top,
                        bottom,
                      )}
                    />
                  ) : null}
                  <path
                    className={styles.trackPath}
                    d={
                      isActivated
                        ? linePath(
                            points,
                            metric,
                            metric.domain,
                            top,
                            bottom,
                          )
                        : zeroBaselinePath(reveal, bottom)
                    }
                    pathLength="1"
                  />
                </g>
                {isActivated &&
                metric.activationProgress > 0 &&
                reveal >= metric.activationProgress ? (
                  <line
                    className={styles.activationStem}
                    x1={xPosition(metric.activationProgress)}
                    x2={xPosition(metric.activationProgress)}
                    y1={zeroBaselineY(bottom)}
                    y2={yPosition(
                      metric.domain[0],
                      metric.domain,
                      top,
                      bottom,
                      metric.scaleType,
                      metric.activationProgress,
                    )}
                  />
                ) : null}
                {reveal > 0 ? (
                  <circle
                    className={styles.trackMarker}
                    cx={markerX}
                    cy={markerY}
                    r="3"
                  />
                ) : null}
                <g className={styles.stagePoints}>
                  {points.map((point) =>
                    isStagePointVisible(
                      reveal,
                      point.progress,
                      metric.activationProgress,
                      isActivated,
                    ) ? (
                      <circle
                        className={styles.stagePoint}
                        cx={xPosition(point.progress)}
                        cy={yPosition(
                          point[key],
                          metric.domain,
                          top,
                          bottom,
                          metric.scaleType,
                          metric.activationProgress,
                        )}
                        key={point.id}
                        r="2.75"
                      />
                    ) : null,
                  )}
                </g>
                <text className={styles.trackName} x={plot.left} y={top - 5}>
                  {metric.label}
                </text>
                <text
                  className={`${styles.trackValue} ${styles.metricValue}`}
                  x={plot.right}
                  y={top - 5}
                  textAnchor="end"
                >
                  {formatChartMetricValue(value, metric.formatter)}
                </text>
              </g>
            );
          })}
        </g>

        <g className={styles.stageAxis}>
          {points.map((point, index) => (
            <g
              className={
                inspectionStageIndex === index ? styles.activeStageTick : undefined
              }
              key={point.id}
              transform={`translate(${xPosition(point.progress)} ${chartBottom + 28})`}
            >
              <line y1="-8" y2="0" />
              <text
                className={styles.stageLabelFull}
                y="18"
                textAnchor={
                  point.progress === 0
                    ? "start"
                    : point.progress === 1
                      ? "end"
                      : "middle"
                }
              >
                {point.milestone.toUpperCase()}
              </text>
              <text
                className={styles.stageLabelCompact}
                y="18"
                textAnchor={
                  point.progress === 0
                    ? "start"
                    : point.progress === 1
                      ? "end"
                      : "middle"
                }
              >
                {(railStageLabels[point.stageId] ?? point.milestone).toUpperCase()}
              </text>
            </g>
          ))}
        </g>
        </svg>

        {enableStageInspection && !compact ? (
          <section
            className={`${styles.stageSummaryPanel}${isInspecting ? ` ${styles.isVisible}` : ""}`}
            style={{
              left: `${(plot.left / 760) * 100}%`,
              top: `${((plot.primaryBottom + plot.trackGap - 14) / viewBoxHeight) * 100}%`,
              width: `${((plot.right - plot.left) / 760) * 100}%`,
              height: `${((chartBottom - plot.primaryBottom - plot.trackGap + 15) / viewBoxHeight) * 100}%`,
            }}
            aria-label="Stage summary"
            aria-hidden={!isInspecting}
          >
            <div className={styles.stageSummaryHead}>
              <h3>Stage summary</h3>
              <span>Scrub $NOCK path</span>
            </div>
            <p className={styles.stageSummaryIntro}>
              How the model changes at the selected point.
            </p>
            <ol className={styles.stageSummaryList}>
              {points.map((point, index) => (
                <li
                  className={
                    inspectionStageIndex === index ? styles.active : undefined
                  }
                  aria-current={
                    inspectionStageIndex === index ? "step" : undefined
                  }
                  key={point.id}
                >
                  <strong>{point.milestone}</strong>
                  <span>{point.stageSummary}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {enableStageInspection && !compact ? (
          <div
            className={styles.primaryScrubber}
            style={{
              left: `${(plot.left / 760) * 100}%`,
              top: `${(plot.primaryTop / viewBoxHeight) * 100}%`,
              width: `${((plot.right - plot.left) / 760) * 100}%`,
              height: `${((plot.primaryBottom - plot.primaryTop) / viewBoxHeight) * 100}%`,
            }}
            role="slider"
            tabIndex={0}
            aria-label="$NOCK stage summary inspector"
            aria-describedby={captionId}
            aria-orientation="horizontal"
            aria-valuemin={1}
            aria-valuemax={points.length}
            aria-valuenow={keyboardStageIndex + 1}
            aria-valuetext={`${points[keyboardStageIndex].milestone}. ${points[keyboardStageIndex].stageSummary}`}
            data-inspecting={isInspecting ? "true" : "false"}
            onPointerEnter={updateInspectionFromPointer}
            onPointerMove={updateInspectionFromPointer}
            onFocus={() => {
              hoverDismissedRef.current = false;
              keyboardFocusRef.current = true;
              setInspectionProgress((current) =>
                current === null ? points[keyboardStageIndex].progress : current,
              );
            }}
            onBlur={() => {
              keyboardFocusRef.current = false;
              if (!pointerInsideRef.current) {
                setInspectionProgress(null);
              }
            }}
            onKeyDown={handleInspectionKeyDown}
          />
        ) : null}
      </div>

      <figcaption id={captionId} className={styles.chartCaption}>
        <span className={styles.chartMetricDescription}>
          {metrics
            .map((metric) => {
              const value =
                metric.key === primaryMetricKey
                  ? inspectionValue ?? primaryValue
                  : sampleMetric(
                      points,
                      metric,
                      viewState.reveal[metric.key],
                      viewState.activatedMetrics.includes(metric.key),
                    );
              return `${metric.label}, ${formatChartMetricValue(value, metric.formatter)}`;
            })
            .join("; ")}
          .{" "}
        </span>
        {viewState.summary}
      </figcaption>
    </figure>
  );
}

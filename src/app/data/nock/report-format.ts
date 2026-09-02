import type { FormatterKey } from "./report-types";

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatSi(value: number) {
  const units = [
    { threshold: 1_000_000_000, suffix: "G" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "k" },
  ] as const;
  const unit = units.find(({ threshold }) => Math.abs(value) >= threshold);
  if (!unit) {
    return value.toFixed(Math.abs(value) < 10 ? 1 : 0);
  }
  const scaled = value / unit.threshold;
  return `${scaled.toFixed(Math.abs(scaled) < 10 ? 1 : 0)}${unit.suffix}`;
}

function formatCurrency(value: number) {
  const units = [
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ] as const;
  const unit = units.find(({ threshold }) => Math.abs(value) >= threshold);

  if (!unit) {
    const baseValue = value.toFixed(Math.abs(value) < 100 ? 1 : 0).replace(/\.0$/, "");
    return `$${baseValue}`;
  }

  const scaled = value / unit.threshold;
  const compactValue = scaled
    .toFixed(Math.abs(scaled) < 100 ? 1 : 0)
    .replace(/\.0$/, "");
  return `$${compactValue}${unit.suffix}`;
}

function formatPercent(value: number) {
  const precision =
    value === 0
      ? 3
      : value < 0.001
        ? 4
        : value < 0.01
          ? 3
          : value < 0.1
            ? 2
            : value < 1
              ? 1
              : 0;
  return `${value.toFixed(precision)}%`;
}

export function formatMetricValue(value: number, formatter: FormatterKey) {
  if (formatter === "currency") {
    return formatCurrency(value);
  }
  if (formatter === "emac") {
    return formatSi(value);
  }
  if (formatter === "revenue") {
    return formatCurrency(value);
  }
  return formatPercent(value);
}

export function formatChartMetricValue(value: number, formatter: FormatterKey) {
  if (formatter === "emac") {
    return `${integerFormatter.format(Math.round(value))} EMAC/s`;
  }
  if (formatter === "revenue") {
    return `${formatCurrency(value)}/yr`;
  }
  if (formatter === "percent") {
    return formatPercent(value);
  }
  return formatCurrency(value);
}

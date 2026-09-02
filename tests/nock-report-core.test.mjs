import assert from "node:assert/strict";
import test from "node:test";

import {
  formatChartMetricValue,
  formatMetricValue,
} from "../src/app/data/nock/report-format.ts";
import {
  isStagePointVisible,
  reportStageProgress,
  sampleMetric,
  stagedLogValue,
} from "../src/app/data/nock/report-model.ts";
import { resolveReportViewState } from "../src/app/data/nock/report-state.ts";
import {
  createSessionToken,
  DATA_ROOM_DEFAULT_DESTINATION,
  DATA_ROOM_SESSION_LIFETIME_SECONDS,
  getSafeDataRoomNextPath,
  verifySessionToken,
} from "../src/app/data/session-core.ts";

const secret = Buffer.from("unit-test-session-secret-at-least-32-bytes", "utf8");

test("data-room session tokens verify, expire, and reject tampering", () => {
  const issuedAt = 1_800_000_000;
  const { token, expiresAt } = createSessionToken(secret, issuedAt);

  assert.equal(verifySessionToken(token, secret, issuedAt + 1), true);
  assert.equal(expiresAt, issuedAt + DATA_ROOM_SESSION_LIFETIME_SECONDS);
  assert.equal(verifySessionToken(token, secret, expiresAt), false);

  const [payload, signature] = token.split(".");
  const tamperedSignature = `${signature.slice(0, -1)}${signature.endsWith("A") ? "B" : "A"}`;
  assert.equal(verifySessionToken(`${payload}.${tamperedSignature}`, secret, issuedAt + 1), false);
  assert.equal(verifySessionToken("malformed", secret, issuedAt + 1), false);
});

test("data-room next destinations are allowlisted", () => {
  assert.equal(getSafeDataRoomNextPath("/data/nock"), "/data/nock");
  assert.equal(
    getSafeDataRoomNextPath("/data/nock?view=stage-2#stage-2"),
    "/data/nock?view=stage-2#stage-2",
  );
  assert.equal(getSafeDataRoomNextPath("https://example.com"), DATA_ROOM_DEFAULT_DESTINATION);
  assert.equal(getSafeDataRoomNextPath("//example.com/data/nock"), DATA_ROOM_DEFAULT_DESTINATION);
  assert.equal(getSafeDataRoomNextPath("/data"), DATA_ROOM_DEFAULT_DESTINATION);
  assert.equal(getSafeDataRoomNextPath("/data\\nock"), DATA_ROOM_DEFAULT_DESTINATION);
});

test("metric formatters preserve units and SI-scale work rate", () => {
  assert.equal(formatMetricValue(12.5, "currency"), "$12.5");
  assert.equal(formatMetricValue(12_500_000_000, "currency"), "$12.5B");
  assert.equal(formatMetricValue(625_000_000, "currency"), "$625M");
  assert.equal(formatMetricValue(1_250, "emac"), "1.3k");
  assert.equal(formatMetricValue(25, "revenue"), "$25");
  assert.equal(formatMetricValue(12_500_000_000, "revenue"), "$12.5B");
  assert.equal(formatMetricValue(20, "percent"), "20%");
  assert.equal(formatMetricValue(0.0001, "percent"), "0.0001%");
});

test("chart metric values include compact units at the requested endpoints", () => {
  assert.equal(formatChartMetricValue(70_000_000, "currency"), "$70M");
  assert.equal(formatChartMetricValue(10_000_000_000, "currency"), "$10B");
  assert.equal(formatChartMetricValue(1, "emac"), "1 EMAC/s");
  assert.equal(formatChartMetricValue(20_000, "emac"), "20,000 EMAC/s");
  assert.equal(formatChartMetricValue(50_000_000, "revenue"), "$50M/yr");
  assert.equal(formatChartMetricValue(20_000_000_000, "revenue"), "$20B/yr");
  assert.equal(formatChartMetricValue(0, "percent"), "0.000%");
  assert.equal(formatChartMetricValue(0.0001, "percent"), "0.0001%");
  assert.equal(formatChartMetricValue(10, "percent"), "10%");
});

test("delayed log metrics stay at zero through Primer and activate at Stage 1", () => {
  const revenueDomain = [50_000_000, 20_000_000_000];
  const shareDomain = [0.0001, 10];
  const activation = reportStageProgress.stage1;
  const midpoint = activation + (1 - activation) / 2;

  assert.equal(reportStageProgress.primer, 0);
  assert.equal(stagedLogValue(revenueDomain, activation - 0.01, activation), 0);
  assert.equal(
    stagedLogValue(revenueDomain, activation, activation),
    revenueDomain[0],
  );
  assert.equal(stagedLogValue(revenueDomain, 1, activation), revenueDomain[1]);
  assert.equal(stagedLogValue(shareDomain, activation - 0.01, activation), 0);
  assert.equal(stagedLogValue(shareDomain, activation, activation), 0.0001);
  assert.equal(stagedLogValue(shareDomain, 1, activation), 10);
  assert.ok(
    Math.abs(
      stagedLogValue(revenueDomain, midpoint, activation) -
        Math.sqrt(revenueDomain[0] * revenueDomain[1]),
    ) < 0.001,
  );

  const metric = {
    key: "inferenceRevenue",
    scaleType: "log",
    activationProgress: activation,
  };
  const points = [
    { progress: 0, inferenceRevenue: 0 },
    { progress: activation, inferenceRevenue: revenueDomain[0] },
    {
      progress: reportStageProgress.stage2,
      inferenceRevenue: stagedLogValue(
        revenueDomain,
        reportStageProgress.stage2,
        activation,
      ),
    },
    { progress: 1, inferenceRevenue: revenueDomain[1] },
  ];

  assert.equal(sampleMetric(points, metric, activation - 0.01), 0);
  assert.equal(sampleMetric(points, metric, activation, false), 0);
  assert.equal(sampleMetric(points, metric, midpoint, false), 0);
  assert.equal(sampleMetric(points, metric, activation, true), revenueDomain[0]);
  assert.ok(Number.isFinite(sampleMetric(points, metric, midpoint, true)));
});

test("stage points appear only after their line reaches an available milestone", () => {
  const activation = reportStageProgress.stage1;

  assert.equal(isStagePointVisible(0, reportStageProgress.primer, 0, true), false);
  assert.equal(isStagePointVisible(0.01, reportStageProgress.primer, 0, true), true);
  assert.equal(
    isStagePointVisible(activation - 0.01, activation, 0, true),
    false,
  );
  assert.equal(isStagePointVisible(activation, activation, 0, true), true);

  assert.equal(
    isStagePointVisible(activation, reportStageProgress.primer, activation, false),
    true,
  );
  assert.equal(
    isStagePointVisible(activation, activation, activation, false),
    false,
  );
  assert.equal(
    isStagePointVisible(activation, activation, activation, true),
    true,
  );
  assert.equal(
    isStagePointVisible(reportStageProgress.stage2, activation, activation, true),
    true,
  );
  assert.equal(
    isStagePointVisible(
      reportStageProgress.stage2 - 0.01,
      reportStageProgress.stage2,
      activation,
      true,
    ),
    false,
  );
  assert.equal(
    isStagePointVisible(
      reportStageProgress.stage3 - 0.01,
      reportStageProgress.stage3,
      activation,
      true,
    ),
    false,
  );
  assert.equal(
    isStagePointVisible(
      reportStageProgress.stage3,
      reportStageProgress.stage3,
      activation,
      true,
    ),
    true,
  );
});

test("cue resolution interpolates normally and snaps for reduced motion", () => {
  const cues = [
    {
      id: "first",
      sectionId: "cover",
      stageId: "cover",
      chapterIndex: 0,
      chapterLabel: "Calibration",
      activeMetric: "tokenValue",
      activatedMetrics: ["tokenValue", "workRate"],
      domainMax: 40,
      reveal: {
        tokenValue: 0,
        workRate: 0,
        inferenceRevenue: 0,
        globalConsumption: 0,
      },
      annotation: "First",
      annotationIds: ["annotation"],
      emphasizedPointId: "point-1",
      visibleRange: [0, 0],
      summary: "First state",
    },
    {
      id: "second",
      sectionId: "stage-1",
      stageId: "stage-1",
      chapterIndex: 1,
      chapterLabel: "Stage 1",
      activeMetric: "workRate",
      activatedMetrics: [
        "tokenValue",
        "workRate",
        "inferenceRevenue",
        "globalConsumption",
      ],
      domainMax: 80,
      reveal: {
        tokenValue: 0.5,
        workRate: 0.5,
        inferenceRevenue: 0,
        globalConsumption: 0,
      },
      annotation: "Second",
      annotationIds: ["annotation"],
      emphasizedPointId: "point-2",
      visibleRange: [0, 0.5],
      summary: "Second state",
    },
  ];

  const interpolated = resolveReportViewState(cues, 1, 0.5, false);
  assert.equal(interpolated.domainMax, 60);
  assert.equal(interpolated.reveal.tokenValue, 0.25);
  assert.equal(interpolated.reveal.workRate, 0.25);
  assert.deepEqual(interpolated.activatedMetrics, [
    "tokenValue",
    "workRate",
    "inferenceRevenue",
    "globalConsumption",
  ]);

  const snapped = resolveReportViewState(cues, 1, 0.01, true);
  assert.equal(snapped.domainMax, 80);
  assert.equal(snapped.reveal.tokenValue, 0.5);
  assert.equal(snapped.activeMetric, "workRate");

  const reversed = resolveReportViewState(cues, 0, 1, false);
  assert.deepEqual(reversed.activatedMetrics, ["tokenValue", "workRate"]);
});

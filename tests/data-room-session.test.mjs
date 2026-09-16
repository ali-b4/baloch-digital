import assert from "node:assert/strict";
import test from "node:test";
import {
  createSessionToken,
  DATA_ROOM_SESSION_LIFETIME_SECONDS,
  verifySessionToken,
} from "../src/app/data/session-core.ts";
import {
  DATA_ROOM_DEFAULT_DESTINATION,
  dataRoomEntries,
  getSafeDataRoomNextPath,
} from "../src/app/data/entries.ts";

const secret = Buffer.from("unit-test-session-secret-at-least-32-bytes", "utf8");

test("data-room session tokens verify, expire, and reject tampering", () => {
  const issuedAt = 1_800_000_000;
  const { token, expiresAt } = createSessionToken(secret, issuedAt);

  assert.equal(verifySessionToken(token, secret, issuedAt + 1), true);
  assert.equal(expiresAt, issuedAt + DATA_ROOM_SESSION_LIFETIME_SECONDS);
  assert.equal(verifySessionToken(token, secret, expiresAt), false);

  const [payload, signature] = token.split(".");
  const tamperedSignature = `${signature.startsWith("A") ? "B" : "A"}${signature.slice(1)}`;
  assert.equal(verifySessionToken(`${payload}.${tamperedSignature}`, secret, issuedAt + 1), false);
  assert.equal(verifySessionToken("malformed", secret, issuedAt + 1), false);
});

test("data-room next destinations are allowlisted", () => {
  const destinations = [
    DATA_ROOM_DEFAULT_DESTINATION,
    ...Object.values(dataRoomEntries).map((entry) => entry.href),
  ];

  for (const destination of destinations) {
    assert.equal(getSafeDataRoomNextPath(destination), destination);
  }
  assert.equal(
    getSafeDataRoomNextPath("/data/nock?view=stage-2#stage-2"),
    "/data/nock?view=stage-2#stage-2",
  );
  assert.equal(
    getSafeDataRoomNextPath("/dash/hobbyist-inference-economics?view=cost#results"),
    "/dash/hobbyist-inference-economics?view=cost#results",
  );

  for (const destination of [
    undefined,
    null,
    123,
    "",
    "https://example.com",
    "//example.com/data/nock",
    "/data\\nock",
    "/data/unlisted-thesis",
    "/dash/unlisted-dashboard",
    "/data/nock/extra",
    "/data/nock/../../admin",
    "/data/%2e%2e/admin",
    "/%2f%2fexample.com",
  ]) {
    assert.equal(getSafeDataRoomNextPath(destination), DATA_ROOM_DEFAULT_DESTINATION);
  }
  assert.equal(DATA_ROOM_DEFAULT_DESTINATION, "/data");
});

test("sessions reject a rotated secret and tokens issued too far in the future", () => {
  const issuedAt = 1_800_000_000;
  const { token } = createSessionToken(secret, issuedAt);
  const rotatedSecret = Buffer.from("a-different-session-secret-at-least-32-bytes", "utf8");

  assert.equal(verifySessionToken(token, rotatedSecret, issuedAt + 1), false);
  assert.equal(verifySessionToken(token, secret, issuedAt - 61), false);
  assert.equal(verifySessionToken(token, secret, issuedAt - 60), true);
});

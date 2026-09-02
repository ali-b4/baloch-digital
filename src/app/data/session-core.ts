import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export const DATA_ROOM_DEFAULT_DESTINATION = "/data/nock";
export const DATA_ROOM_SESSION_LIFETIME_SECONDS = 7 * 24 * 60 * 60;
export const DATA_ROOM_SESSION_SECRET_MINIMUM_BYTES = 32;

const DATA_ROOM_SESSION_VERSION = 1;
const DATA_ROOM_SIGNATURE_CONTEXT = "baloch-dataroom-session-v1";
const SAFE_URL_ORIGIN = "https://dataroom.invalid";
const ALLOWED_DATA_ROOM_PATHS = new Set([DATA_ROOM_DEFAULT_DESTINATION]);

type DataRoomSessionPayload = {
  v: typeof DATA_ROOM_SESSION_VERSION;
  iat: number;
  exp: number;
};

export function hashCredential(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function signPayload(encodedPayload: string, secret: Buffer) {
  return createHmac("sha256", secret)
    .update(DATA_ROOM_SIGNATURE_CONTEXT, "utf8")
    .update(".", "utf8")
    .update(encodedPayload, "utf8")
    .digest();
}

export function createSessionToken(secret: Buffer, issuedAt: number) {
  const payload: DataRoomSessionPayload = {
    v: DATA_ROOM_SESSION_VERSION,
    iat: issuedAt,
    exp: issuedAt + DATA_ROOM_SESSION_LIFETIME_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const encodedSignature = signPayload(encodedPayload, secret).toString(
    "base64url",
  );

  return {
    token: `${encodedPayload}.${encodedSignature}`,
    expiresAt: payload.exp,
  };
}

function isSessionPayload(value: unknown): value is DataRoomSessionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<DataRoomSessionPayload>;

  return (
    payload.v === DATA_ROOM_SESSION_VERSION &&
    Number.isInteger(payload.iat) &&
    Number.isInteger(payload.exp) &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number" &&
    payload.exp - payload.iat === DATA_ROOM_SESSION_LIFETIME_SECONDS
  );
}

export function verifySessionToken(token: string, secret: Buffer, now: number) {
  const segments = token.split(".");

  if (
    segments.length !== 2 ||
    !segments[0] ||
    !segments[1] ||
    !/^[A-Za-z0-9_-]+$/.test(segments[0]) ||
    !/^[A-Za-z0-9_-]+$/.test(segments[1])
  ) {
    return false;
  }

  const [encodedPayload, encodedSignature] = segments;
  const suppliedSignature = Buffer.from(encodedSignature, "base64url");
  const expectedSignature = signPayload(encodedPayload, secret);

  if (
    suppliedSignature.byteLength !== expectedSignature.byteLength ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as unknown;

    return isSessionPayload(payload) && payload.iat <= now + 60 && payload.exp > now;
  } catch {
    return false;
  }
}

export function getSafeDataRoomNextPath(value: unknown) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return DATA_ROOM_DEFAULT_DESTINATION;
  }

  try {
    const url = new URL(value, SAFE_URL_ORIGIN);

    if (
      url.origin !== SAFE_URL_ORIGIN ||
      !ALLOWED_DATA_ROOM_PATHS.has(url.pathname)
    ) {
      return DATA_ROOM_DEFAULT_DESTINATION;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DATA_ROOM_DEFAULT_DESTINATION;
  }
}

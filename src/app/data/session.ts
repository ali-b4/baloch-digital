import "server-only";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  createSessionToken,
  DATA_ROOM_SESSION_LIFETIME_SECONDS,
  DATA_ROOM_SESSION_SECRET_MINIMUM_BYTES,
  hashCredential,
  verifySessionToken,
} from "./session-core";

export { getSafeDataRoomNextPath } from "./session-core";

const DATA_ROOM_COOKIE_NAME = "baloch-dataroom-session";
const DATA_ROOM_COOKIE_PATH = "/data";

function getPassword() {
  const password = process.env.DATAROOM_PASSWORD;
  return password && password.length > 0 ? password : null;
}

function getSessionSecret() {
  const secret = process.env.DATAROOM_SESSION_SECRET;

  if (!secret) {
    return null;
  }

  const encodedSecret = Buffer.from(secret, "utf8");
  return encodedSecret.byteLength >= DATA_ROOM_SESSION_SECRET_MINIMUM_BYTES
    ? encodedSecret
    : null;
}

export function isDataRoomConfigured() {
  return getPassword() !== null && getSessionSecret() !== null;
}

export function verifyDataRoomPassword(candidate: string) {
  const expected = getPassword();

  if (expected === null) {
    return false;
  }

  return timingSafeEqual(hashCredential(candidate), hashCredential(expected));
}

export async function hasValidDataRoomSession() {
  if (!isDataRoomConfigured()) {
    return false;
  }

  const secret = getSessionSecret();

  if (secret === null) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(DATA_ROOM_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifySessionToken(token, secret, Math.floor(Date.now() / 1000));
}

export async function createDataRoomSession() {
  const secret = getSessionSecret();

  if (secret === null) {
    return false;
  }

  const { token, expiresAt } = createSessionToken(
    secret,
    Math.floor(Date.now() / 1000),
  );
  const cookieStore = await cookies();

  cookieStore.set(DATA_ROOM_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: DATA_ROOM_COOKIE_PATH,
    expires: new Date(expiresAt * 1000),
    maxAge: DATA_ROOM_SESSION_LIFETIME_SECONDS,
    priority: "high",
  });

  return true;
}

export async function clearDataRoomSession() {
  const cookieStore = await cookies();

  cookieStore.set(DATA_ROOM_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: DATA_ROOM_COOKIE_PATH,
    expires: new Date(0),
    maxAge: 0,
    priority: "high",
  });
}

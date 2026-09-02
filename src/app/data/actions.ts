"use server";

import { redirect } from "next/navigation";
import {
  clearDataRoomSession,
  createDataRoomSession,
  getSafeDataRoomNextPath,
  isDataRoomConfigured,
  verifyDataRoomPassword,
} from "./session";

export type DataRoomAuthState = {
  status: "idle" | "invalid" | "unavailable";
  message: string;
};

export async function authenticateDataRoom(
  _previousState: DataRoomAuthState,
  formData: FormData,
): Promise<DataRoomAuthState> {
  const destination = getSafeDataRoomNextPath(formData.get("next"));
  const submittedPassword = formData.get("password");

  if (!isDataRoomConfigured()) {
    return {
      status: "unavailable",
      message: "Authorization is temporarily unavailable.",
    };
  }

  if (
    typeof submittedPassword !== "string" ||
    !verifyDataRoomPassword(submittedPassword)
  ) {
    return {
      status: "invalid",
      message: "Invalid passphrase",
    };
  }

  const sessionCreated = await createDataRoomSession();

  if (!sessionCreated) {
    return {
      status: "unavailable",
      message: "Authorization is temporarily unavailable.",
    };
  }

  redirect(destination);
}

export async function lockDataRoom() {
  await clearDataRoomSession();
  redirect("/data");
}

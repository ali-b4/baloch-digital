"use client";

import { useActionState } from "react";
import {
  authenticateDataRoom,
  type DataRoomAuthState,
} from "./actions";

type DataRoomGateProps = {
  available: boolean;
  nextPath: string;
};

export default function DataRoomGate({
  available,
  nextPath,
}: DataRoomGateProps) {
  const initialState: DataRoomAuthState = available
    ? { status: "idle", message: "" }
    : {
        status: "unavailable",
        message: "Authorization is temporarily unavailable.",
      };
  const [state, formAction, pending] = useActionState(
    authenticateDataRoom,
    initialState,
  );
  const hasMessage = state.message.length > 0;

  return (
    <form className="data-room-form" action={formAction}>
      <h2>Authorization</h2>

      <label className="data-room-label" htmlFor="data-room-password">
        Password // Required
      </label>
      <div className="data-room-control">
        <input type="hidden" name="next" value={nextPath} />
        <input
          id="data-room-password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-describedby={hasMessage ? "data-room-message" : undefined}
          aria-invalid={state.status === "invalid" ? true : undefined}
          disabled={!available || pending}
          required
        />
        <button type="submit" disabled={!available || pending}>
          {pending ? "Authenticating" : "Authenticate"}
        </button>
      </div>

      {hasMessage ? (
        <p id="data-room-message" className="data-room-message" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

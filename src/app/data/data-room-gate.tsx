"use client";

import { FormEvent, useState } from "react";

export default function DataRoomGate() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Invalid passphrase");
  }

  return (
    <form className="data-room-form" onSubmit={handleSubmit}>
      <h2>Authorization</h2>

      <label className="data-room-label" htmlFor="data-room-password">
        Password // Required
      </label>
      <div className="data-room-control">
        <input
          id="data-room-password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-describedby={message ? "data-room-message" : undefined}
          aria-invalid={message ? true : undefined}
          required
        />
        <button type="submit">Authenticate</button>
      </div>

      {message ? (
        <p id="data-room-message" className="data-room-message" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}

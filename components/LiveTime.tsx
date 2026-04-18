"use client";

import { useEffect, useState } from "react";

type State = {
  time: string;
  status: "working" | "offline" | "sleeping";
};

function getMumbaiState(): State {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(now);

  const hourStr = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(now);
  const hour = parseInt(hourStr, 10);

  let status: State["status"] = "working";
  if (hour >= 23 || hour < 8) status = "sleeping";
  else if (hour >= 20) status = "offline";

  return { time, status };
}

export function LiveTime() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    setState(getMumbaiState());
    const interval = setInterval(() => setState(getMumbaiState()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Server render: reserve space with invisible placeholder to avoid layout shift
  if (!state) {
    return (
      <span className="tabular-nums opacity-0" aria-hidden>
        Mumbai · 00:00 · working
      </span>
    );
  }

  return (
    <span className="tabular-nums" title={`Local time in Mumbai · ${state.time}`}>
      Mumbai · <span>{state.time}</span> · {state.status}
    </span>
  );
}

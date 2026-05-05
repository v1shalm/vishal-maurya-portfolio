"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = { slug: string };

export function UnlockForm({ slug }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password) return;
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Wrong password");
        return;
      }

      router.refresh();
      router.replace(`/work/${slug}`);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <label className="flex flex-col gap-2">
        <span className="text-[13px] text-muted">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          placeholder="Enter password"
          aria-invalid={status === "error"}
          className="rounded-lg bg-bg-elevated px-4 py-3 text-[16px] text-ink outline-none placeholder:text-muted focus-visible:shadow-[inset_0_0_0_2px_var(--color-yellow)]"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting" || !password}
        className="btn btn--yellow self-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Checking..." : "Unlock"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-[1.25em] text-[13px] ${
          status === "error" ? "text-[color:var(--color-pink)]" : "text-muted"
        }`}
      >
        {message ?? ""}
      </p>
    </form>
  );
}

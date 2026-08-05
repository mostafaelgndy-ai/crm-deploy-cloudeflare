import type { Ticket } from "./types";

/** Generate a unique id with a prefix (e.g. "p_a1b2c3d"). */
export function uid(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

/** Return today's date as an ISO date string (YYYY-MM-DD). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Format a date string (YYYY-MM-DD) into a human-readable label. */
export function fmtDate(d: string | null): string {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Trigger a browser download of the ticket's agent description as a
 * `<title>.md` file. Only the agent description is included in the file.
 */
export function downloadTicketMarkdown(ticket: Ticket): void {
  const safeTitle = (ticket.title || "ticket")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-");
  const content = ticket.agentDescription || "";
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeTitle}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
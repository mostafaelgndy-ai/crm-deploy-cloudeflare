import { PanelCard } from "./PanelCard";

/**
 * Empty state card — shown when a list has no items.
 */
export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="col-span-full panel-card p-10 text-center text-muted">
      <p className="font-display text-lg text-[#EDEFF3] mb-1">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/** Compact empty row for admin lists. */
export function EmptyRow({ message }: { message: string }) {
  return (
    <PanelCard className="p-10 text-center text-muted text-sm">
      {message}
    </PanelCard>
  );
}
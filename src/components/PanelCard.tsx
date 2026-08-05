import type { ReactNode } from "react";

/**
 * Dark panel container — used for cards, forms, and modals.
 */
export function PanelCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel-card ${className}`}>
      {children}
    </div>
  );
}
import type { ReactNode } from "react";

/**
 * Form field label — mono font, uppercase, muted color.
 */
export function FieldLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`field-label block mb-1.5 ${className}`}>
      {children}
    </label>
  );
}